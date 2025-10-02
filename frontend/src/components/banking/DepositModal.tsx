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
import { Loader2, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";

const depositSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        })
        .refine((val) => Number(val) <= 10000, {
            message: "Maximum deposit amount is $10,000",
        })
        .refine((val) => Number(val) >= 1, {
            message: "Minimum deposit amount is $1",
        }),
});

type DepositFormData = z.infer<typeof depositSchema>;

interface DepositModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DepositModal({ open, onOpenChange, onSuccess }: DepositModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<DepositFormData>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            amount: "",
        },
    });

    const onSubmit = async (data: DepositFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await bankingService.deposit({ amount: Number(data.amount) });
            
            if (response.success) {
                toast.success("Deposit successful!", {
                    description: `$${data.amount} has been deposited to your account.`,
                });
                form.reset();
                onOpenChange(false);
                onSuccess?.();
            } else {
                setError("Deposit failed. Please try again.");
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
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Plus className="h-4 w-4 text-green-600" />
                        </div>
                        Deposit Money
                    </DialogTitle>
                    <DialogDescription>
                        Add money to your account. Enter the amount you want to deposit.
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
                                    <FormLabel>Deposit Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                min="1"
                                                max="10000"
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
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Deposit {watchedAmount && `$${watchedAmount}`}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
