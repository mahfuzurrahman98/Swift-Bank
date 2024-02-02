import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import ComponentLoader from '../components/ComponentLoader';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { AccountType, statusType } from '../types';
import RootLayout from './RootLayout';

const Beneficiaries = () => {
    const [account, setAccount] = useState<AccountType>({} as AccountType);
    const [beneficiaryId, setBeneficiaryId] = useState<string>('');
    const [status, setStatus] = useState<statusType>({
        loading: true,
        error: null,
    });

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const getAccount = async () => {
        try {
            const response = await axiosPrivate.get('/accounts');
            setAccount(response.data.data.account);
        } catch (error: any) {
            setAccount({} as AccountType);
            throw error;
        }
    };

    const handleCreateBeneficiary = async () => {
        try {
            if (beneficiaryId.trim() === '') {
                toast.error('Please mention the account no.');
                return;
            }
            const response = await axiosPrivate.post(
                '/accounts/beneficiaries',
                {
                    beneficiaryId: beneficiaryId,
                }
            );

            toast.success(response.data.data.message);
            getAccount();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        console.log('token:', auth.token);
        (async () => {
            try {
                await getAccount();
            } catch (error) {
                console.error(error);
            } finally {
                setStatus({ loading: false, error: null });
            }
        })();
    }, [auth.token]);

    return (
        <ComponentLoader
            status={status}
            component={
                <RootLayout>
                    <div className="block w-full overflow-x-auto">
                        <div className="flex justify-end items-center mt-2">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCreateBeneficiary();
                                }}
                                className="flex gap-x-2"
                            >
                                <input
                                    type="text"
                                    value={beneficiaryId}
                                    onChange={(e) =>
                                        setBeneficiaryId(e.target.value)
                                    }
                                    placeholder="Beneficiary acc id"
                                    className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <button
                                    type="submit"
                                    className="px-2 py-1 bg-blue-700 text-white rounded-md"
                                >
                                    Add Beneficiary
                                </button>
                            </form>
                        </div>

                        <table className="items-center bg-transparent w-full border-2 mt-3">
                            <thead>
                                <tr>
                                    <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Account No.
                                    </th>
                                    <th className="px-6 bg-gray-200 text-black align-middle border border-solid border-gray-100 py-3 text-sm border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Account Name
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {account?.beneficiaries?.map((beneficiary) => (
                                    <tr key={beneficiary?._id}>
                                        <td className="border-t-2 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                            {beneficiary?._id}
                                        </td>
                                        <td className="border-t-2 px-6 align-center border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                            {beneficiary?.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </RootLayout>
            }
        />
    );
};

export default Beneficiaries;
