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

    return (
        <div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse ">
                    <thead>
                        <tr>
                            <th className="px-6 bg-gray-50 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Date
                            </th>
                            <th className="px-6 bg-gray-50 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Type
                            </th>
                            <th className="px-6 bg-gray-50 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Amount
                            </th>
                            <th className="px-6 bg-gray-50 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Balance
                            </th>
                            <th className="px-6 bg-gray-50 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                To
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left text-gray-700">
                                    {formatMongoDate(transaction.createdAt)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 ">
                                    {transaction.type}
                                </td>
                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {transaction.amount}
                                </td>
                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {transaction.balance}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {transaction.toAccountId}
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
