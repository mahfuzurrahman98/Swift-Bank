import { useState } from 'react';

const Deposit = ({ deposit }: { deposit: (amount: number) => void }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string>('');

    const handleDeposit = async () => {
        try {
            setError('');
            await deposit(Number(amount));
            setAmount('');
        } catch (error: any) {
            console.log(error.response.data.message);
            setError(error.response.data.message as string);
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="text-lg font-semibold mb-1">Deposit</h3>
            <div className="flex gap-2 items-center">
                <input
                    className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button
                    className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    onClick={handleDeposit}
                >
                    Deposit
                </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Deposit;
