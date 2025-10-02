import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, DollarSign, Minus } from "lucide-react";
import { toast } from "sonner";

const withdrawSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        })
        .refine((val) => Number(val) >= 1, {
            message: "Minimum withdrawal amount is $1",
        }),
});

type WithdrawFormData = z.infer<typeof withdrawSchema>;

interface WithdrawModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function WithdrawModal({ open, onOpenChange, onSuccess }: WithdrawModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            amount: "",
        },
    });

    const onSubmit = async (data: WithdrawFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await bankingService.withdraw({ amount: Number(data.amount) });
            
            if (response.success) {
                toast.success("Withdrawal successful!", {
                    description: `$${data.amount} has been withdrawn from your account.`,
                });
                form.reset();
                onOpenChange(false);
                onSuccess?.();
            } else {
                setError(response.message || "Withdrawal failed. Please try again.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            form.reset();
            setError(null);
            onOpenChange(false);
        }
    };

    const watchedAmount = form.watch("amount");

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Minus className="h-4 w-4 text-red-600" />
                        </div>
                        Withdraw Money
                    </DialogTitle>
                    <DialogDescription>
                        Withdraw money from your account. Enter the amount you want to withdraw.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Amount Input */}
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
                                                step="0.01"
                                                min="1"
                                                placeholder="0.00"
                                                className="pl-10"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Quick Amount Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quick amounts:</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[50, 100, 500].map((amount) => (
                                    <Button
                                        key={amount}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => form.setValue("amount", amount.toString())}
                                        disabled={isLoading}
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

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
                                disabled={isLoading || !form.formState.isValid}
                                variant="destructive"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Withdraw {watchedAmount && `$${watchedAmount}`}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
