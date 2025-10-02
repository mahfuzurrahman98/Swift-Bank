import { useEffect, useState } from "react";
import { bankingService } from "@/services/banking-service";
import { Button } from "@/components/ui/button";
import { BeneficiaryModal } from "@/components/banking/BeneficiaryModal";
import { BeneficiaryListingComponent } from "@/components/banking/BeneficiaryListingComponent";
import { TableLoader } from "@/components/loaders/table/TableLoader";
import { TableEmpty } from "@/components/loaders/table/TableEmpty";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { UserPlus2 } from "lucide-react";
import type { Beneficiary } from "@/utils/interfaces/banking";

export default function BeneficiariesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);

    const fetchBeneficiaries = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const { data } = await bankingService.getBeneficiaries();
            setBeneficiaries(data.beneficiaries);
        } catch (err: any) {
            setError(err.message || "Failed to fetch beneficiaries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBeneficiaryAdded = () => {
        fetchBeneficiaries();
    };

    const handleBeneficiaryRemoved = () => {
        fetchBeneficiaries();
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    return (
        <div className="max-w-7xl w-full space-y-6">
            <div className="flex justify-between items-center border-b-2 pb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Beneficiaries
                </h1>
                <Button onClick={() => setBeneficiaryModalOpen(true)}>
                    <UserPlus2 className="size-4" />
                    Add Beneficiary
                </Button>
            </div>

            {error ? (
                <AlertMessage type="error" message={error} />
            ) : (
                <>
                    {isLoading ? (
                        <TableLoader message="Loading beneficiaries..." />
                    ) : !error ? (
                        beneficiaries.length > 0 ? (
                            <BeneficiaryListingComponent
                                beneficiaries={beneficiaries}
                                onBeneficiaryRemoved={handleBeneficiaryRemoved}
                            />
                        ) : (
                            <TableEmpty message="No beneficiaries found. Add one to get started!" />
                        )
                    ) : null}
                </>
            )}

            <BeneficiaryModal
                open={beneficiaryModalOpen}
                onOpenChange={setBeneficiaryModalOpen}
                onSuccess={handleBeneficiaryAdded}
            />
        </div>
    );
}
