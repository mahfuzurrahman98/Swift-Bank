import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import Deposit from '../components/accounts/Deposit';
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
            const response = await axiosPrivate.post('/accounts/deposit', {
                amount,
            });
            setAccount(response.data.data.account);
            console.log(response.data);
        } catch (error: any) {
            throw error;
        } finally {
            await getTransactions();
        }
    };

    const withdraw = async (amount: number) => {
        try {
            const response = await axiosPrivate.post('/accounts/withdraw', {
                amount,
            });
            setAccount(response.data.data.account);
        } catch (error: any) {
            throw error;
        } finally {
            await getTransactions();
        }
    };

    // const transfer = async (amount: number, to: string) => {
    //     try {
    //         const response = await axiosPrivate.post('/accounts/transfer', {
    //             amount,
    //             to,
    //         });
    //         setAccount(response.data.data.account);
    //     } catch (error: any) {
    //         throw error;
    //     } finally {
    //         await getTransactions();
    //     }
    // };

    useEffect(() => {
        console.log('token:', auth.token);
        (async () => {
            await getAccount();
            await getTransactions();
            setStatus({ loading: false, error: null });
        })();
        setStatus({ loading: false, error: null });
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
                        <div className="mb-4">
                            Your account balance is:{' '}
                            <span className="font-semibold">
                                {account.balance}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mb-4">
                            <div className="w-full">
                                <Deposit deposit={deposit} />
                            </div>
                            <div className="w-full">
                                <Withdraw withdraw={withdraw} />
                            </div>
                            <div className="w-full  mb-4">
                                <Link to="/transfer">Fund Transfer</Link>
                            </div>
                        </div>
                        <Transactions
                            transactions={transactions}
                            accountId={account._id}
                        />
                    </RootLayout>
                </>
            }
        />
    );
};

export default Dashboard;
