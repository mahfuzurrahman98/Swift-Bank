import { useEffect, useState } from 'react';
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

    const transfer = async (amount: number, to: string) => {
        try {
            const response = await axiosPrivate.post('/accounts/transfer', {
                amount,
                to,
            });
            setAccount(response.data.data.account);
        } catch (error: any) {
            throw error;
        } finally {
            await getTransactions();
        }
    };

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
                <RootLayout>
                    <div className="mb-4">
                        Your account balance is:{' '}
                        <span className="font-semibold">{account.balance}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-4">
                        <div className="w-full">
                            <Deposit deposit={deposit} />
                        </div>
                        <div className="w-full">
                            <Withdraw withdraw={withdraw} />
                        </div>
                        <p>asdfsadf</p>
                        {/* <div className="w-full md:w-1/3 px-4 mb-4">
                                <Transfer onTransfer={transfer} />
                            </div> */}
                    </div>
                    <Transactions transactions={transactions} />
                </RootLayout>
            }
        />
    );
};

export default Dashboard;
