import { TransactionType } from '../../types';

const Transactions = ({
    transactions,
}: {
    transactions: TransactionType[];
}) => {
    const formatMongoDate = (mongoDate: string): string => {
        const date = new Date(mongoDate);
        const options: any = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        };
        return date.toLocaleDateString('en-US', options);
    };

    const formatAmount = (amount: number): string => {
        // format with commas
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'BDT',
        });
    };

    const TransactionBadge: React.FC<{ type: string }> = ({ type }) => {
        const getBadgeColorForTransactionType = (
            transactionType: string
        ): { backgroundColor: string; textColor: string } => {
            if (
                transactionType === 'deposit' ||
                transactionType === 'transfered in'
            ) {
                return {
                    backgroundColor: 'bg-green-100',
                    textColor: 'text-green-800',
                };
            }

            if (
                transactionType === 'withdraw' ||
                transactionType === 'transfered out'
            ) {
                return {
                    backgroundColor: 'bg-red-100',
                    textColor: 'text-red-800',
                };
            }

            return {
                backgroundColor: 'bg-gray-100',
                textColor: 'text-gray-800',
            };
        };

        const badgeColor = getBadgeColorForTransactionType(type);

        return (
            <span
                className={`inline-block rounded-full px-2 py- ${badgeColor.backgroundColor} ${badgeColor.textColor}`}
            >
                {type}
            </span>
        );
    };

    return (
        <div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-2 ">
                    <thead>
                        <tr>
                            <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Date
                            </th>
                            <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Type
                            </th>
                            <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Amount
                            </th>
                            <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Balance
                            </th>
                            <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Particular
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td className="border-t-2 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                                    {formatMongoDate(transaction.createdAt)}
                                </td>
                                <td className="border-t-2 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    <TransactionBadge type={transaction.type} />
                                </td>
                                <td className="border-t-2 px-6 align-center border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {formatAmount(transaction.amount)}
                                </td>
                                <td className="border-t-2 px-6 align-center border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {formatAmount(transaction.balance)}
                                </td>
                                <td className="border-t-2 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {transaction.particular}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
