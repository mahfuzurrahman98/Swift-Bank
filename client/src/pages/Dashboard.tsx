import { useEffect, useState } from 'react';
import ComponentLoader from '../components/ComponentLoader';
import Deposit from '../components/accounts/Deposit';
import FundTransfer from '../components/accounts/FundTransfer';
import Transactions from '../components/accounts/Transactions';
import Withdraw from '../components/accounts/Withdraw';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { AccountType, TransactionType, statusType } from '../types';
import RootLayout from './RootLayout';

const Dashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const [account, setAccount] = useState<AccountType>({} as AccountType);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const { auth } = useAuth();
    const [status, setStatus] = useState<statusType>({
        loading: true,
        error: null,
    });

    const getAccount = async () => {
        try {
            const response = await axiosPrivate.get('/accounts');
            setAccount(response.data.data.account);
        } catch (error: any) {
            setAccount({} as AccountType);
            throw error;
        }
    };

    const getTransactions = async () => {
        try {
            const response = await axiosPrivate.get('/accounts/transactions');
            setTransactions(response.data.data.transactions);
        } catch (error: any) {
            setTransactions([]);
            throw error;
        }
    };

    const deposit = async (amount: number) => {
        try {
            await axiosPrivate.post('/accounts/deposit', {
                amount,
            });
        } catch (error: any) {
            throw error;
        } finally {
            await getAccount();
            await getTransactions();
        }
    };

    const withdraw = async (amount: number) => {
        try {
            await axiosPrivate.post('/accounts/withdraw', {
                amount,
            });
        } catch (error: any) {
            throw error;
        } finally {
            await getAccount();
            await getTransactions();
        }
    };

    const transfer = async (amount: number, toAccountId: string) => {
        try {
            await axiosPrivate.post('/accounts/transfer', {
                amount,
                toAccountId,
            });
        } catch (error: any) {
            throw error;
        } finally {
            await getAccount();
            await getTransactions();
        }
    };

    useEffect(() => {
        console.log('token:', auth.token);
        (async () => {
            try {
                await getAccount();
                await getTransactions();
            } catch (error: any) {
                console.log(error);
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
                    <RootLayout>
                        <div className="mb-4">
                            Your account balance is:{' '}
                            <span className="font-semibold">
                                {account.balance}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-4">
                            <div className="flex flex-col gap-y-5 p-4 rounded-md border-gray-300 border-2">
                                <div className="w-full">
                                    <Deposit deposit={deposit} />
                                </div>
                                <div className="w-full">
                                    <Withdraw withdraw={withdraw} />
                                </div>
                            </div>
                            <div className="w-full p-4 rounded-md border-gray-300 border-2">
                                <FundTransfer
                                    fundTransfer={transfer}
                                    beneficiaries={account.beneficiaries}
                                />
                            </div>
                        </div>
                        <Transactions transactions={transactions} />
                    </RootLayout>
                </>
            }
        />
    );
};

export default Dashboard;
