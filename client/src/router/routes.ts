import GoogleLoginCallback from '../pages/GoogleLoginCallback';
import Home from '../pages/Home';
import Login from '../pages/Login';

import { RouteType } from '../types';

const routes: RouteType[] = [
    { path: '/', element: Home, _protected: -1 },
    { path: '/login', element: Login, _protected: 0 },
    {
        path: '/auth/google/callback',
        element: GoogleLoginCallback,
        _protected: 0,
    },
    { path: '/', element: Dashboard, _protected: -1 },


];

export default routes;
