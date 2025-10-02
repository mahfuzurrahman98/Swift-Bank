import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { TransactionType } from "@/utils/enums/transaction";
import type { Transaction } from "@/utils/interfaces/banking";

interface TransactionTableProps {
    transactions: Transaction[];
    loading?: boolean;
}

const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
        case TransactionType.DEPOSIT:
            return "bg-green-100 text-green-800";
        case TransactionType.WITHDRAWAL:
            return "bg-red-100 text-red-800";
        case TransactionType.TRANSFER_IN:
        case TransactionType.TRANSFER_OUT:
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const formatAmount = (amount: number, type: TransactionType) => {
    const sign = type === TransactionType.WITHDRAWAL ? "-" : "+";
    return `${sign}$${amount.toFixed(2)}`;
};

export function TransactionTable({
    transactions,
    loading = false,
}: TransactionTableProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No transactions found
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                            <TableCell>
                                {format(
                                    new Date(transaction.createdAt),
                                    "MMM dd, yyyy"
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={getTransactionTypeColor(
                                        transaction.type
                                    )}
                                >
                                    {transaction.type}
                                </Badge>
                            </TableCell>
                            <TableCell>{transaction.particular}</TableCell>
                            <TableCell className="text-right font-medium">
                                <span
                                    className={
                                        transaction.type ===
                                        TransactionType.WITHDRAWAL
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }
                                >
                                    {formatAmount(
                                        transaction.amount,
                                        transaction.type
                                    )}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
