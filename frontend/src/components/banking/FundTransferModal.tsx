import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { Loader, Send, User, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bankingService } from "@/services/banking-service";
import { transferSchema } from "@/utils/schemas/account-schemas";
import type {
    TransferRequest,
    Beneficiary,
    Account,
} from "@/utils/interfaces/banking";
import type { z } from "zod";

type TransferFormData = z.infer<typeof transferSchema>;

interface FundTransferModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTransferSuccess?: () => void;
}

export function FundTransferModal({
    open,
    onOpenChange,
    onTransferSuccess,
}: FundTransferModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [account, setAccount] = useState<Account | null>(null);
    const [loadingData, setLoadingData] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            toAccountId: "",
            amount: 0,
        },
    });

    const selectedBeneficiaryId = watch("toAccountId");
    const selectedBeneficiary = beneficiaries.find(
        (b) => b.accountId === selectedBeneficiaryId
    );

    // Load account and beneficiaries data
    useEffect(() => {
        if (open) {
            loadInitialData();
        }
    }, [open]);

    const loadInitialData = async () => {
        try {
            setLoadingData(true);
            setError("");

            // Load account and beneficiaries in parallel
            const [accountResponse, beneficiariesResponse] = await Promise.all([
                bankingService.getAccount(),
                bankingService.getBeneficiaries({ page: 1, limit: 100 }),
            ]);

            setAccount(accountResponse.data.account);
            setBeneficiaries(beneficiariesResponse.data.beneficiaries);
        } catch (err: any) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoadingData(false);
        }
    };

    const onSubmit = async (data: TransferFormData) => {
        try {
            setIsLoading(true);
            setError("");

            const transferData: TransferRequest = {
                toAccountId: data.toAccountId,
                amount: data.amount,
            };

            await bankingService.transfer(transferData);

            toast.success(
                `Successfully transferred $${data.amount} to ${selectedBeneficiary?.name}`
            );

            reset();
            onOpenChange(false);
            onTransferSuccess?.();
        } catch (err: any) {
            setError(err.message || "Transfer failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            reset();
            setError("");
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className="sm:max-w-md [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="size-5" />
                        Fund Transfer
                    </DialogTitle>
                    <DialogDescription>
                        Transfer money to your beneficiaries instantly and
                        securely.
                    </DialogDescription>
                </DialogHeader>

                {loadingData ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="size-6 animate-spin" />
                        <span className="ml-2">Loading data...</span>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Account Balance Display */}
                        {account && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Available Balance
                                    </span>
                                    <span className="text-lg font-semibold text-green-600">
                                        ${account.balance.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Beneficiary Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="toAccountId">Transfer To</Label>
                            <Select
                                value={selectedBeneficiaryId}
                                onValueChange={(value) =>
                                    setValue("toAccountId", value)
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a beneficiary">
                                        {selectedBeneficiary?.name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {beneficiaries.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                            No beneficiaries found. Add one
                                            first.
                                        </div>
                                    ) : (
                                        beneficiaries.map((beneficiary) => (
                                            <SelectItem
                                                key={beneficiary.accountId}
                                                value={beneficiary.accountId}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="size-4" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {beneficiary.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {beneficiary.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.toAccountId && (
                                <p className="text-sm text-red-600">
                                    {errors.toAccountId.message}
                                </p>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    type="number"
                                    min="1"
                                    max={account?.balance || 0}
                                    placeholder="0"
                                    className="pl-10"
                                    disabled={isLoading}
                                    {...register("amount", {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-sm text-red-600">
                                    {errors.amount.message}
                                </p>
                            )}
                            {account && watch("amount") > account.balance && (
                                <p className="text-sm text-red-600">
                                    Amount exceeds available balance
                                </p>
                            )}
                        </div>

                        {/* Selected Beneficiary Preview */}
                        {selectedBeneficiary && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <User className="size-4 text-blue-600" />
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {selectedBeneficiary.name}
                                        </div>
                                        <div className="text-sm text-blue-700">
                                            {selectedBeneficiary.email}
                                        </div>
                                        <div className="text-xs text-blue-600 font-mono">
                                            Account:{" "}
                                            {selectedBeneficiary.accountId}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && <AlertMessage type="error" message={error} />}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !selectedBeneficiaryId}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="size-4 animate-spin" />
                                        Transferring
                                    </>
                                ) : (
                                    <>
                                        <Send className="size-4" />
                                        Transfer ${watch("amount") || "0"}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
