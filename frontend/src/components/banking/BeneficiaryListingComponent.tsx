import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { bankingService } from "@/services/banking-service";
import type { Beneficiary } from "@/utils/interfaces/banking";

interface BeneficiaryListingComponentProps {
    beneficiaries: Beneficiary[];
    onBeneficiaryRemoved: () => void;
}

export function BeneficiaryListingComponent({
    beneficiaries,
    onBeneficiaryRemoved,
}: BeneficiaryListingComponentProps) {
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemoveBeneficiary = async (beneficiaryId: string) => {
        try {
            setRemovingId(beneficiaryId);
            await bankingService.removeBeneficiary(beneficiaryId);
            toast.success("Beneficiary removed successfully");
            onBeneficiaryRemoved();
        } catch (err: any) {
            toast.error(err.message || "Failed to remove beneficiary");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Your Beneficiaries ({beneficiaries.length})
                </CardTitle>
                <CardDescription>
                    People and accounts you can transfer money to
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {beneficiaries.map((beneficiary: Beneficiary) => (
                        <div
                            key={beneficiary.accountId}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {beneficiary.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{beneficiary.email}</span>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    Account No: {beneficiary.accountId}
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleRemoveBeneficiary(
                                        beneficiary.accountId
                                    )
                                }
                                disabled={removingId === beneficiary.accountId}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                {removingId === beneficiary.accountId ? (
                                    "Removing..."
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
