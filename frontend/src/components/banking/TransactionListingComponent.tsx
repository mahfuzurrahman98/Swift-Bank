import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/helpers";
import type { Transaction } from "@/utils/interfaces/banking";

interface TransactionListingComponentProps {
    transactions: Transaction[];
}

export function TransactionListingComponent({
    transactions,
}: TransactionListingComponentProps) {
    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "deposit":
                return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
            case "withdraw":
                return <ArrowUpRight className="h-4 w-4 text-red-600" />;
            case "transfer":
                return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
            default:
                return <ArrowUpRight className="h-4 w-4" />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case "deposit":
                return "text-green-600";
            case "withdraw":
                return "text-red-600";
            case "transfer":
                return "text-blue-600";
            default:
                return "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                    All your deposits, withdrawals, and transfers
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-full">
                                    {getTransactionIcon(transaction.type)}
                                </div>
                                <div>
                                    <p className="font-medium capitalize">
                                        {transaction.type}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(transaction.createdAt)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {transaction.particular}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`font-semibold ${getTransactionColor(
                                        transaction.type
                                    )}`}
                                >
                                    {transaction.type === "deposit" ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Balance: {formatCurrency(transaction.balance)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
