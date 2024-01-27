import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({
            token: '',
        });
        try {
            await axiosPrivate.post('/users/logout');
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export default useLogout;
