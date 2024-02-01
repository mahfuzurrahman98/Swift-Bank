import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import ComponentLoader from '../components/ComponentLoader';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { AccountType, statusType } from '../types';
import RootLayout from './RootLayout';

const Beneficiaries = () => {
    const [account, setAccount] = useState<AccountType>({} as AccountType);
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
                <>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            className: '',
                            duration: 5000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                            },
                        }}
                    />
                    <RootLayout>
                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-2 ">
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
                                    {account?.beneficiaries?.map(
                                        (beneficiary) => (
                                            <tr key={beneficiary?._id}>
                                                <td className="border-t-2 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                                    {beneficiary?._id}
                                                </td>
                                                <td className="border-t-2 px-6 align-center border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                                    {beneficiary?.name}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </RootLayout>
                </>
            }
        />
    );
};

export default Beneficiaries;
