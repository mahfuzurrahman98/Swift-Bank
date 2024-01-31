import { useState } from 'react';
import toast from 'react-hot-toast';

const Withdraw = ({ withdraw }: { withdraw: (amount: number) => void }) => {
    const [amount, setAmount] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);

    const handleWithdraw = async () => {
        try {
            setBtnLoading(true);
            await withdraw(Number(amount));
            toast.success('Withdrawal successful');
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
            <h3 className="text-lg font-semibold mb-1">Withdraw</h3>
            <div className="flex gap-2 items-center">
                <input
                    className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                {btnLoading ? (
                    <button className="flex items-center gap-x-1 bg-gray-500 px-3 py-1 rounded cursor-not-allowed">
                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                        <span className="text-white">Loading...</span>
                    </button>
                ) : (
                    <button
                        className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        onClick={handleWithdraw}
                    >
                        Withdraw
                    </button>
                )}
            </div>
        </div>
    );
};

export default Withdraw;
