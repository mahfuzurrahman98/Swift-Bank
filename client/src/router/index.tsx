import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PersistLogin from '../components/PersistLogin';
import Error from '../pages/Error';
import ProtectedRoute from './ProtectedRoute';
import routes from './routes';

import { RouteType } from '../types';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PersistLogin key={-1} />}>
          {routes &&
            routes.map((route: RouteType, key: number) => {
              if (route._protected === -1) {
                // means thes route is public, it doesn't bother whether the user is logged in or not
                return (
                  <Route
                    key={key}
                    path={route.path}
                    element={<route.element />}
                  />
                );
              } else {
                // means the route is protected, it will check whether the user is logged in or not
                return (
                  <Route
                    key={key}
                    element={<ProtectedRoute _protected={route._protected} />}
                  >
                    <Route path={route.path} element={<route.element />} />
                  </Route>
                );
              }
            })}
        </Route>
        <Route path="*" element={<Error code={404} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
