import Dashboard from '../pages/Dashboard';
// import GoogleLoginCallback from '../pages/GoogleLoginCallback';
import Login from '../pages/Login';

import Beneficiaries from '../pages/Beneficiaries';
import { RouteType } from '../types';

const routes: RouteType[] = [
    { path: '/login', element: Login, _protected: 0 },
    // {
    //     path: '/auth/google/callback',
    //     element: GoogleLoginCallback,
    //     _protected: 0,
    // },
    { path: '/', element: Dashboard, _protected: -1 },
    { path: '/beneficiaries', element: Beneficiaries, _protected: -1 },
];

export default routes;
