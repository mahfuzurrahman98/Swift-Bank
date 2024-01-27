import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { statusType } from '../types';
import RootLayout from './RootLayout';

const MessageDiv = () => {
    // give a good message and show a link to login
    return (
        <div className="p-3 lg:p-12 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold">Welcome,</h1>
            <p className="text-lg">
                You are not logged in. Please{' '}
                <span className="text-amber-800 underline">
                    <Link to="/login">login</Link>
                </span>{' '}
                to proceed.
            </p>
        </div>
    );
};

const Home = () => {
    const axiosPrivate = useAxiosPrivate();
    const [img, setImg] = useState<string>('');
    const { auth } = useAuth();
    const [status, setStatus] = useState<statusType>({
        loading: true,
        error: null,
    });

    const getImage = async () => {
        try {
            const response = await axiosPrivate.get('/');
            setImg(import.meta.env.VITE_SERVER_URL + response.data.data.image);
        } catch (error: any) {
            setImg('');
            throw error;
        }
    };

    useEffect(() => {
        console.log('token:', auth.token);
        console.log('image:', img);
        if (auth.token != '') {
            (async () => {
                try {
                    await getImage();
                    setStatus({
                        loading: false,
                        error: null,
                    });
                } catch (error: any) {
                    console.log(error);
                }
            })();
        } else {
            setStatus({
                loading: false,
                error: null,
            });
        }
    }, [auth.token]);

    return (
        <ComponentLoader
            status={status}
            component={
                <RootLayout>
                    <div className="">
                        {auth.token ? <img src={img} alt="" /> : <MessageDiv />}
                    </div>
                </RootLayout>
            }
        />
    );
};

export default Home;
