import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface BeneficiaryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function BeneficiaryModal({ open, onOpenChange }: BeneficiaryModalProps) {
    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        Manage Beneficiaries
                    </DialogTitle>
                    <DialogDescription>
                        Add or remove beneficiaries for money transfers.
                    </DialogDescription>
                </DialogHeader>

                <div className="text-center py-8">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Beneficiary management is temporarily unavailable.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            This feature will be available soon.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
