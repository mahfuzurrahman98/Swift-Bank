import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        try {
            await axiosPrivate.post('/users/logout');
            setAuth({
                token: '',
            });
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export default useLogout;
