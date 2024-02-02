import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import Loading from '../components/Loading';
import useAuth from '../hooks/useAuth';

const ErrMsg = ({ errMsg }: { errMsg: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex flex-col gap-y-3">
                <div>
                    <p className="font-bold">Error!</p>
                    <p className="">{errMsg}</p>
                </div>
                <div>
                    <Link
                        className="px-4 py-1 text-white rounded hover:bg-gray-600 bg-black"
                        to={'/'}
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
};

const GoogleLoginCallback = () => {
    const [searchParams] = useSearchParams();
    const [errMsg, setErrMsg] = useState<string>('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const login = async (code: string) => {
        try {
            const response = await axios.post('/users/google-login', {
                code,
            });
            const accessToken = response.data.data.accessToken;

            let localData = JSON.parse(localStorage.getItem('data') || '{}');
            localData['message'] = response.data.message;
            localStorage.setItem('data', JSON.stringify(localData));

            setAuth({ token: accessToken, name: response.data.data.user.name });
        } catch (error: any) {
            setErrMsg(error.message);
            throw new Error(error.message);
        }
    };

    useEffect(() => {
        (async () => {
            const code = searchParams.get('code') || '';
            if (code != '') {
                await login(code);

                let localData = JSON.parse(
                    localStorage.getItem('data') || '{}'
                );
                toast.success(localData.message);
                localStorage.removeItem('data');
            } else {
                navigate('/');
            }
        })();
    }, []);

    return <>{errMsg ? <ErrMsg errMsg={errMsg} /> : <Loading />}</>;
};

export default GoogleLoginCallback;
