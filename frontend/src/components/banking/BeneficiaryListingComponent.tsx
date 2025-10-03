import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    User,
    Mail,
    Trash2,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { bankingService } from "@/services/banking-service";
import type { Beneficiary } from "@/utils/interfaces/banking";

interface BeneficiaryListingComponentProps {
    beneficiaries: Beneficiary[];
    onBeneficiaryRemoved: () => void;
    // Search props
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onClearSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    // Pagination props
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function BeneficiaryListingComponent({
    beneficiaries,
    onBeneficiaryRemoved,
    searchInput,
    onSearchInputChange,
    onClearSearch,
    onKeyPress,
    currentPage,
    totalPages,
    hasMore,
    onPageChange,
    isLoading = false,
}: BeneficiaryListingComponentProps) {
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<Beneficiary | null>(null);

    const handleDeleteClick = (beneficiary: Beneficiary) => {
        setBeneficiaryToDelete(beneficiary);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!beneficiaryToDelete) return;

        try {
            setRemovingId(beneficiaryToDelete.accountId);
            await bankingService.removeBeneficiary(beneficiaryToDelete.accountId);
            toast.success("Beneficiary removed successfully");
            onBeneficiaryRemoved();
        } catch (err: any) {
            toast.error(err.message || "Failed to remove beneficiary");
        } finally {
            setRemovingId(null);
            setDeleteDialogOpen(false);
            setBeneficiaryToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setBeneficiaryToDelete(null);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                Your Beneficiaries ({beneficiaries.length})
                            </CardTitle>
                            <CardDescription>
                                People and accounts you can transfer money to
                            </CardDescription>
                        </div>

                        {/* Compact Search Box */}
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search beneficiaries..."
                                value={searchInput}
                                onChange={(e) =>
                                    onSearchInputChange(e.target.value)
                                }
                                onKeyPress={onKeyPress}
                                className="pl-10 pr-10"
                                disabled={isLoading}
                            />
                            {searchInput && (
                                <button
                                    onClick={onClearSearch}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    type="button"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
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
                                    onClick={() => handleDeleteClick(beneficiary)}
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || isLoading}
                                >
                                    <ChevronLeft className="size-4" />
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={!hasMore || isLoading}
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Beneficiary</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove{" "}
                            <span className="font-semibold">
                                {beneficiaryToDelete?.name}
                            </span>{" "}
                            from your beneficiaries list? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={removingId === beneficiaryToDelete?.accountId}
                        >
                            {removingId === beneficiaryToDelete?.accountId
                                ? "Removing..."
                                : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
