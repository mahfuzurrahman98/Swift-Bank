import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';
import useLogout from './useLogout';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
  const refreshToken = useRefreshToken();
  const logout = useLogout();
  const { auth } = useAuth();

  useEffect(() => {
    // request interceptor
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // response interceptor
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const previousRequest = error.config;
        if (error.response.status === 401 && !previousRequest.sent) {
          previousRequest.sent = true;
          try {
            const newAccessToken = await refreshToken();
            previousRequest.headers[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;
            return axiosPrivate(previousRequest);
          } catch (err) {
            console.log(err);
            logout();
            return Promise.reject(error);
          }
        } else {
          console.log(error);
          // logout();
          return Promise.reject(error);
        }
      }
    );

    // cleanup
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.token, refreshToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
