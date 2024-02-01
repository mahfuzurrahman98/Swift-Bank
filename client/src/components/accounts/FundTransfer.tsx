import { useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { BeneficiaryType } from '../../types';

const FundTransfer = ({
    fundTransfer,
    beneficiaries,
}: {
    fundTransfer: (amount: number, toAccountId: string) => void;
    beneficiaries: BeneficiaryType[] | undefined;
}) => {
    const [fund, setFund] = useState({ amount: '', toAccountId: '' });
    const [btnLoading, setBtnLoading] = useState(false);

    const options = beneficiaries?.map((beneficiary) => ({
        label: beneficiary.name + ' - ' + beneficiary._id,
        value: beneficiary._id,
    }));

    const handleSelectChange = (selectedOption: any) => {
        console.log('Selected option:', selectedOption);
        if (selectedOption) {
            setFund({ ...fund, toAccountId: selectedOption.value });
        } else {
            setFund({ ...fund, toAccountId: '' });
        }
    };

    const handleFundTransfer = async () => {
        try {
            setBtnLoading(true);
            await fundTransfer(Number(fund.amount), fund.toAccountId);
            toast.success('FundTransfer successful');
            setFund({ amount: '', toAccountId: '' });
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
            <h3 className="text-lg font-semibold mb-1">Fund Transfer</h3>
            <div className="flex flex-col gap-2">
                <input
                    className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    type="number"
                    placeholder="Enter amount"
                    value={fund.amount}
                    onChange={(e) =>
                        setFund({ ...fund, amount: e.target.value })
                    }
                    disabled={btnLoading}
                />

                {options && (
                    <Select
                        defaultValue={undefined}
                        options={options}
                        onChange={handleSelectChange}
                        isDisabled={!options || btnLoading}
                        placeholder={'Select beneficiary'}
                    />
                )}
                {btnLoading ? (
                    <button className="flex items-center gap-x-1 bg-gray-500 px-3 py-1 rounded cursor-not-allowed">
                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                        <span className="text-white">Loading...</span>
                    </button>
                ) : (
                    <button
                        className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        onClick={handleFundTransfer}
                    >
                        Transfer
                    </button>
                )}
            </div>
        </div>
    );
};

export default FundTransfer;
