import { useEffect, useState } from 'react';
import ComponentLoader from '../components/ComponentLoader';
import MessageDiv from '../components/MessageDiv';
import Transactions from '../components/accounts/Transactions';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { AccountType, TransactionType, statusType } from '../types';
import RootLayout from './RootLayout';

const Dashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const [account, setAccount] = useState<AccountType[]>([]);
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
            setAccount([]);
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

    useEffect(() => {
        console.log('token:', auth.token);
        if (auth.token !== '') {
            (async () => {
                await getAccount();
                await getTransactions();
                setStatus({ loading: false, error: null });
            })();
        } else {
            setStatus({ loading: false, error: null });
        }
    }, [auth.token]);

    return (
        <ComponentLoader
            status={status}
            component={
                <RootLayout>
                    <div className="">
                        {auth.token ? (
                            <div>
                                <Transactions transactions={transactions} />
                            </div>
                        ) : (
                            <MessageDiv />
                        )}
                    </div>
                </RootLayout>
            }
        />
    );
};

export default Dashboard;
