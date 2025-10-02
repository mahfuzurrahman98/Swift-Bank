import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Users } from "lucide-react";

interface TransferModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ArrowUpDown className="h-4 w-4 text-blue-600" />
                        </div>
                        Transfer Money
                    </DialogTitle>
                    <DialogDescription>
                        Transfer money to your beneficiaries.
                    </DialogDescription>
                </DialogHeader>

                <div className="text-center py-8">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Transfer feature is temporarily unavailable.
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
