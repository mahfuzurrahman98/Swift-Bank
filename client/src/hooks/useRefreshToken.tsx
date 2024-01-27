import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axiosPrivate.post('/users/refresh-token');
            console.log('refresh: ', response);
            const data = response.data.data;

            setAuth({
                token: data.accessToken,
            });

            return data.accessToken;
        } catch (error) {
            console.log('error from useRefreshToken.tsx', error);
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;
