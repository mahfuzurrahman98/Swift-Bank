import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { bankingService } from "@/services/banking-service";
import { TransactionListingComponent } from "@/components/banking/TransactionListingComponent";
import { TableLoader } from "@/components/loaders/table/TableLoader";
import { TableEmpty } from "@/components/loaders/table/TableEmpty";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { DatePicker } from "@/components/ui/custom/date-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    Calendar,
    Loader2,
} from "lucide-react";
import { TransactionType } from "@/utils/enums/transaction";
import type { Transaction } from "@/utils/interfaces/banking";

export default function TransactionsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Pagination metadata
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Get values from URL or use defaults
    const currentPage = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("q") || "";
    const typeFilter = searchParams.get("type") || "";
    const startDateParam = searchParams.get("startDate") || "";
    const endDateParam = searchParams.get("endDate") || "";

    // Local state for form inputs
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [typeInput, setTypeInput] = useState(typeFilter);
    const [startDateInput, setStartDateInput] = useState<Date | undefined>(
        startDateParam ? new Date(startDateParam) : undefined
    );
    const [endDateInput, setEndDateInput] = useState<Date | undefined>(
        endDateParam ? new Date(endDateParam) : undefined
    );

    // Helper to format date for API (YYYY-MM-DD)
    const formatDateForAPI = (date: Date | undefined): string => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    };

    // Fetch transactions based on URL params
    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const { data } = await bankingService.getTransactions({
                page: currentPage,
                limit,
                q: searchQuery || undefined,
                type: typeFilter || undefined,
                startDate: startDateParam || undefined,
                endDate: endDateParam || undefined,
            });
            setTransactions(data.transactions);

            // Update pagination metadata
            if (data.meta) {
                setTotal(data.meta.total);
                setTotalPages(data.meta.pagination.totalPages);
                setHasMore(data.meta.pagination.hasMore);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch transactions");
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

    // Apply filters
    const handleApplyFilters = () => {
        updateURLParams({
            page: "1", // Reset to first page
            limit: limit.toString(),
            q: searchInput,
            type: typeInput === "all" ? "" : typeInput,
            startDate: formatDateForAPI(startDateInput),
            endDate: formatDateForAPI(endDateInput),
        });
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchInput("");
        setTypeInput("");
        setStartDateInput(undefined);
        setEndDateInput(undefined);
        setSearchParams({});
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleApplyFilters();
        }
    };

    const handlePageChange = (newPage: number) => {
        updateURLParams({
            page: newPage.toString(),
            limit: limit.toString(),
            q: searchQuery,
            type: typeFilter,
            startDate: startDateParam,
            endDate: endDateParam,
        });
    };

    // Fetch when URL params change
    useEffect(() => {
        fetchTransactions();
    }, [searchParams]);

    return (
        <div className="max-w-7xl w-full space-y-6">
            <div className="flex justify-between items-center border-b-2 pb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Transactions
                </h1>
            </div>

            {/* Filters Section */}
            <Card>
                <CardContent className="">
                    <div className="space-y-4">
                        {/* Header with Action Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Filter className="size-4 text-primary" />
                                </div>
                                <h2 className="font-semibold text-lg">
                                    Filter Transactions
                                </h2>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleApplyFilters}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="size-4" />
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="size-4" />
                                            Apply Filters
                                        </>
                                    )}
                                </Button>
                                {(searchQuery ||
                                    typeFilter ||
                                    startDateParam ||
                                    endDateParam) && (
                                    <Button
                                        onClick={handleClearFilters}
                                        disabled={isLoading}
                                        variant="outline"
                                    >
                                        <X className="size-4" />
                                        Clear All
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* All Filters in One Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search Input */}
                            <div className="lg:col-span-2">
                                <Label
                                    htmlFor="search"
                                    className="text-sm font-medium mb-2"
                                >
                                    Search
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by amount, type, or description..."
                                        value={searchInput}
                                        onChange={(e) =>
                                            setSearchInput(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        className="pl-10"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Transaction Type */}
                            <div>
                                <Label
                                    htmlFor="type"
                                    className="text-sm font-medium mb-2"
                                >
                                    Type
                                </Label>
                                <Select
                                    value={typeInput || "all"}
                                    onValueChange={setTypeInput}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem
                                            value={TransactionType.DEPOSIT}
                                        >
                                            💰 Deposit
                                        </SelectItem>
                                        <SelectItem
                                            value={TransactionType.WITHDRAWAL}
                                        >
                                            💸 Withdrawal
                                        </SelectItem>
                                        <SelectItem
                                            value={TransactionType.TRANSFER_IN}
                                        >
                                            📤 Transfer In
                                        </SelectItem>
                                        <SelectItem
                                            value={TransactionType.TRANSFER_OUT}
                                        >
                                            📤 Transfer Out
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Start Date */}
                            <div>
                                <Label
                                    htmlFor="startDate"
                                    className="text-sm font-medium mb-2 flex items-center gap-1"
                                >
                                    <Calendar className="h-3.5 w-3.5" />
                                    Start Date
                                </Label>
                                <DatePicker
                                    id="startDate"
                                    value={startDateInput}
                                    onChange={setStartDateInput}
                                    placeholder="Select start date"
                                    disabled={isLoading}
                                    dateFormat={{
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }}
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <Label
                                    htmlFor="endDate"
                                    className="text-sm font-medium mb-2 flex items-center gap-1"
                                >
                                    <Calendar className="h-3.5 w-3.5" />
                                    End Date
                                </Label>
                                <DatePicker
                                    id="endDate"
                                    value={endDateInput}
                                    onChange={setEndDateInput}
                                    placeholder="Select end date"
                                    disabled={isLoading}
                                    dateFormat={{
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error ? (
                <AlertMessage type="error" message={error} />
            ) : (
                <>
                    {isLoading ? (
                        <TableLoader message="Loading transactions..." />
                    ) : !error ? (
                        transactions.length > 0 ? (
                            <>
                                <TransactionListingComponent
                                    transactions={transactions}
                                />

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing page {currentPage} of{" "}
                                        {totalPages} ({total} total
                                        transactions)
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Items Per Page */}
                                        <div className="flex items-center gap-2">
                                            <Label
                                                htmlFor="pagination-limit"
                                                className="text-sm text-muted-foreground"
                                            >
                                                Show:
                                            </Label>
                                            <Select
                                                value={limit.toString()}
                                                onValueChange={(value) => {
                                                    updateURLParams({
                                                        page: "1",
                                                        limit: value,
                                                        q: searchQuery,
                                                        type: typeFilter,
                                                        startDate:
                                                            startDateParam,
                                                        endDate: endDateParam,
                                                    });
                                                }}
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger
                                                    id="pagination-limit"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">
                                                        10
                                                    </SelectItem>
                                                    <SelectItem value="20">
                                                        20
                                                    </SelectItem>
                                                    <SelectItem value="50">
                                                        50
                                                    </SelectItem>
                                                    <SelectItem value="100">
                                                        100
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                disabled={
                                                    currentPage === 1 ||
                                                    isLoading
                                                }
                                            >
                                                <ChevronLeft className="size-4" />
                                                Prev
                                            </Button>
                                            <div className="text-sm font-medium px-2">
                                                Page {currentPage}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={!hasMore || isLoading}
                                            >
                                                Next
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <TableEmpty message="No transactions found. Make a deposit or transfer to get started!" />
                        )
                    ) : null}
                </>
            )}
        </div>
    );
}
