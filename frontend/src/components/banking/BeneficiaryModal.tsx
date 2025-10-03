import { useState } from "react";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { bankingService } from "@/services/banking-service";
import { addBeneficiarySchema } from "@/utils/schemas/account-schemas";
import type { z } from "zod";

type AddBeneficiaryFormData = z.infer<typeof addBeneficiarySchema>;

interface BeneficiaryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function BeneficiaryModal({
    open,
    onOpenChange,
    onSuccess,
}: BeneficiaryModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AddBeneficiaryFormData>({
        resolver: zodResolver(addBeneficiarySchema),
        defaultValues: {
            beneficiaryId: "",
        },
    });

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
    };

    const handleAddBeneficiary = async (data: AddBeneficiaryFormData) => {
        try {
            setIsLoading(true);
            await bankingService.addBeneficiary(data);

            toast.success("Beneficiary added successfully!");
            handleClose();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to add beneficiary");
        } finally {
            setIsLoading(false);
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
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <UserPlus className="h-4 w-4 text-purple-600" />
                        </div>
                        Add Beneficiary
                    </DialogTitle>
                    <DialogDescription>
                        Add a new beneficiary by entering their account No. You
                        can transfer money to beneficiaries easily.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleAddBeneficiary)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="beneficiaryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Beneficiary Account No.
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter account no. (e.g., 507f1f77bcf86cd799439011)"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-muted-foreground">
                                        Make sure the account no. is correct.
                                        You cannot undo this action easily.
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
                                className="min-w-[60px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <>Add</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
