import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankingService } from "@/services/banking-service";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
    type DepositPayload,
    depositSchema,
} from "@/utils/schemas/account-schemas";

interface DepositModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DepositModal({
    open,
    onOpenChange,
    onSuccess,
}: DepositModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<DepositPayload>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            amount: "",
        },
    });

    const handleDeposit = async (data: DepositPayload) => {
        try {
            setIsLoading(true);
            // Convert string to number for API call
            const amount = parseInt(data.amount, 10);
            await bankingService.deposit({ amount });

            toast.success("Deposit successful!");
            handleClose();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to deposit money");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
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
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        Deposit Money
                    </DialogTitle>
                    <DialogDescription>
                        Add money to your account. Enter the amount you want to
                        deposit.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleDeposit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deposit Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                type="number"
                                                step="1"
                                                min="1"
                                                placeholder="0"
                                                className="pl-10"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-muted-foreground">
                                        Enter the amount you want to deposit.
                                        Minimum $1, Maximum $1,000,000.
                                    </p>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2">
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
                                disabled={isLoading}
                                className="min-w-[84px]"
                            >
                                {isLoading ? (
                                    <Loader className="size-4 animate-spin" />
                                ) : (
                                    <>Deposit</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
