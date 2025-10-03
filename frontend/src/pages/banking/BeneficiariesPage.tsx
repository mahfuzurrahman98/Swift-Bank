import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { bankingService } from "@/services/banking-service";
import { Button } from "@/components/ui/button";
import { BeneficiaryModal } from "@/components/banking/BeneficiaryModal";
import { FundTransferModal } from "@/components/banking/FundTransferModal";
import { BeneficiaryListingComponent } from "@/components/banking/BeneficiaryListingComponent";
import { TableLoader } from "@/components/loaders/table/TableLoader";
import { TableEmpty } from "@/components/loaders/table/TableEmpty";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { UserPlus2, Send } from "lucide-react";
import type { Beneficiary } from "@/utils/interfaces/banking";

export default function BeneficiariesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Get values from URL or use defaults
    const currentPage = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("q") || "";

    // Local state for form inputs
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const fetchBeneficiaries = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const { data } = await bankingService.getBeneficiaries({
                page: currentPage,
                limit,
                q: searchQuery || undefined,
            });
            setBeneficiaries(data.beneficiaries);
            setTotalPages(data.meta.pagination.totalPages);
            setHasMore(data.meta.pagination.hasMore);
        } catch (err: any) {
            setError(err.message || "Failed to fetch beneficiaries");
        } finally {
            setIsLoading(false);
        }
    };

    // Update URL params
    const updateURLParams = (updates: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });

        setSearchParams(newParams);
    };

    // Debounced search function
    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
        
        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout for debounced search
        const newTimeout = setTimeout(() => {
            updateURLParams({
                page: "1", // Reset to first page
                limit: limit.toString(),
                q: value,
            });
        }, 500); // 500ms delay
        
        setSearchTimeout(newTimeout);
    };

    // Clear search filter
    const handleClearSearch = () => {
        setSearchInput("");
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchParams({});
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            // Clear timeout and search immediately on Enter
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            updateURLParams({
                page: "1",
                limit: limit.toString(),
                q: searchInput,
            });
        }
    };

    const handleBeneficiaryAdded = () => {
        fetchBeneficiaries();
    };

    const handleBeneficiaryRemoved = () => {
        fetchBeneficiaries();
    };

    const handleTransferSuccess = () => {
        // Optionally refresh beneficiaries or account data
        fetchBeneficiaries();
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        updateURLParams({
            page: page.toString(),
            limit: limit.toString(),
            q: searchQuery,
        });
    };

    // Fetch when URL params change
    useEffect(() => {
        fetchBeneficiaries();
    }, [searchParams]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    return (
        <div className="max-w-7xl w-full space-y-6">
            <div className="flex justify-between items-center border-b-2 pb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Beneficiaries
                </h1>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setTransferModalOpen(true)}
                        disabled={beneficiaries.length === 0}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Send className="size-4" />
                        Fund Transfer
                    </Button>
                    <Button onClick={() => setBeneficiaryModalOpen(true)}>
                        <UserPlus2 className="size-4" />
                        Add Beneficiary
                    </Button>
                </div>
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
                                searchInput={searchInput}
                                onSearchInputChange={handleSearchInputChange}
                                onClearSearch={handleClearSearch}
                                onKeyPress={handleKeyPress}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                hasMore={hasMore}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
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

            <FundTransferModal
                open={transferModalOpen}
                onOpenChange={setTransferModalOpen}
                onTransferSuccess={handleTransferSuccess}
            />
        </div>
    );
}
