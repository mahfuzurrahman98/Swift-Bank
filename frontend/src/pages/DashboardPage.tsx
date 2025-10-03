import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    CreditCard,
    TrendingUp,
    TrendingDown,
    Send,
    Users,
    Plus,
    Minus,
} from "lucide-react";
import { TransactionTable } from "@/components/banking/TransactionTable";
import { DepositModal } from "@/components/banking/DepositModal";
import { WithdrawModal } from "@/components/banking/WithdrawModal";
import { FundTransferModal } from "@/components/banking/FundTransferModal";
import { bankingService } from "@/services/banking-service";
import type { Account, Transaction } from "@/utils/interfaces/banking";

export default function DashboardPage() {
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accountLoading, setAccountLoading] = useState(false);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [accountError, setAccountError] = useState<string | null>(null);
    const [transactionsError, setTransactionsError] = useState<string | null>(
        null
    );

    // Modal states
    const [depositModalOpen, setDepositModalOpen] = useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    const fetchAccount = async () => {
        setAccountLoading(true);
        setAccountError(null);
        try {
            const { data } = await bankingService.getAccount();
            setAccount(data.account);
        } catch (error) {
            setAccountError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch account"
            );
        } finally {
            setAccountLoading(false);
        }
    };

    const fetchTransactions = async () => {
        setTransactionsLoading(true);
        setTransactionsError(null);
        try {
            const { data } = await bankingService.getTransactions();
            setTransactions(data.transactions);
        } catch (error) {
            setTransactionsError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch transactions"
            );
        } finally {
            setTransactionsLoading(false);
        }
    };

    const refreshData = () => {
        fetchAccount();
        fetchTransactions();
    };

    const handleTransferSuccess = () => {
        refreshData(); // Refresh account and transactions after successful transfer
    };

    useEffect(() => {
        fetchAccount();
        fetchTransactions();
    }, []);

    if (accountLoading) {
        return (
            <div className="max-w-7xl w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-32" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (accountError) {
        return (
            <div className="max-w-7xl w-full">
                <Alert variant="destructive">
                    <AlertDescription>{accountError}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getRecentTransactionStats = () => {
        const recent = transactions.slice(0, 10);
        const deposits = recent.filter((t) => t.type === "deposit").length;
        const withdrawals = recent.filter(
            (t) => t.type === "withdrawal"
        ).length;
        const transfers = recent.filter((t) =>
            t.type.includes("transfer")
        ).length;

        return { deposits, withdrawals, transfers, total: recent.length };
    };

    const stats = getRecentTransactionStats();

    return (
        <div className="max-w-7xl w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 pb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setDepositModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="size-4" />
                        Deposit
                    </Button>
                    <Button
                        onClick={() => setWithdrawModalOpen(true)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                        <Minus className="size-4" />
                        Withdraw
                    </Button>
                    <Button
                        onClick={() => setTransferModalOpen(true)}
                        disabled={!account?.beneficiaries?.length}
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        title={
                            !account?.beneficiaries?.length
                                ? "Add beneficiaries to enable transfers"
                                : "Transfer funds to beneficiaries"
                        }
                    >
                        <Send className="size-4" />
                        Transfer
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Account Balance */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Account Balance
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {account
                                ? formatCurrency(account.balance)
                                : "$0.00"}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge
                                variant={
                                    account?.active ? "default" : "secondary"
                                }
                            >
                                {account?.active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Deposits */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Recent Deposits
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.deposits}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last 10 transactions
                        </p>
                    </CardContent>
                </Card>

                {/* Recent Withdrawals */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Recent Withdrawals
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats.withdrawals}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last 10 transactions
                        </p>
                    </CardContent>
                </Card>

                {/* Beneficiaries */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Beneficiaries
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {account?.beneficiaries?.length || 0}
                        </div>
                        {/* <Button
                            variant="link"
                            className="p-0 h-auto text-xs text-blue-600"
                            onClick={() => setBeneficiaryModalOpen(true)}
                        >
                            Manage beneficiaries
                        </Button> */}
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Transaction History
                    </CardTitle>
                    <CardDescription>
                        View and manage your recent transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {transactionsError ? (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {transactionsError}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <TransactionTable
                            transactions={transactions}
                            loading={transactionsLoading}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            <DepositModal
                open={depositModalOpen}
                onOpenChange={setDepositModalOpen}
                onSuccess={refreshData}
            />
            <WithdrawModal
                open={withdrawModalOpen}
                onOpenChange={setWithdrawModalOpen}
                onSuccess={refreshData}
            />
            <FundTransferModal
                open={transferModalOpen}
                onOpenChange={setTransferModalOpen}
                onTransferSuccess={handleTransferSuccess}
            />
        </div>
    );
}
