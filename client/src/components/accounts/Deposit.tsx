import { useState } from 'react';
import toast from 'react-hot-toast';

const Deposit = ({ deposit }: { deposit: (amount: number) => void }) => {
    const [amount, setAmount] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);

    const handleDeposit = async () => {
        try {
            setBtnLoading(true);
            await deposit(Number(amount));
            toast.success('Deposit successful');
            setAmount('');
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setTimeout(() => {
                setBtnLoading(false);
            }, 3000);
        }
    };

    return (
        <div className="">
            <h3 className="text-lg font-semibold mb-1">Deposit</h3>
            <div className="flex gap-2 items-center justify-between">
                <input
                    className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={btnLoading}
                />
                {btnLoading ? (
                    <button className="flex items-center gap-x-1 bg-gray-500 px-3 py-1 rounded cursor-not-allowed">
                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                        <span className="text-white">Loading...</span>
                    </button>
                ) : (
                    <button
                        className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        onClick={handleDeposit}
                    >
                        Deposit
                    </button>
                )}
            </div>
        </div>
    );
};

export default Deposit;
