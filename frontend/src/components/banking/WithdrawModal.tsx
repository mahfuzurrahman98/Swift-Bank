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
    type WithdrawPayload,
    withdrawSchema,
} from "@/utils/schemas/account-schemas";

interface WithdrawModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function WithdrawModal({
    open,
    onOpenChange,
    onSuccess,
}: WithdrawModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<WithdrawPayload>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            amount: "",
        },
    });

    const handleWithdraw = async (data: WithdrawPayload) => {
        console.log("Form submitted with data:", data);
        try {
            setIsLoading(true);
            // Convert string to number for API call
            const amount = parseInt(data.amount, 10);
            await bankingService.withdraw({ amount });

            toast.success("Withdrawal successful!");
            handleClose();
            onSuccess?.();
        } catch (error: any) {
            console.error("Withdraw error:", error);
            toast.error(error.message || "Failed to withdraw money");
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
                        <div className="p-2 bg-red-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-red-600" />
                        </div>
                        Withdraw Money
                    </DialogTitle>
                    <DialogDescription>
                        Withdraw money from your account. Enter the amount you
                        want to withdraw.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleWithdraw)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Withdrawal Amount</FormLabel>
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
                                        Enter the amount you want to withdraw.
                                        Minimum $1, Maximum $1,000,000.
                                    </p>
                                </FormItem>
                            )}
                        />

                        {/* Quick Amount Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Quick amounts:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[50, 100, 500].map((amount) => (
                                    <Button
                                        key={amount}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            form.setValue("amount", amount.toString())
                                        }
                                        disabled={isLoading}
                                        className="h-8 text-xs"
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                            </div>
                        </div>

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
                                className="min-w-[96px]"
                                variant="destructive"
                            >
                                {isLoading ? (
                                    <Loader className="size-4 animate-spin" />
                                ) : (
                                    <>Withdraw</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
