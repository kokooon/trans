// import React from 'react';
// import type { PathRouteProps } from 'react-router-dom';

// const Home = React.lazy(() => import('@/lib/pages/home'));

// export const routes: Array<PathRouteProps> = [
//   {
//     path: '/',
//     element: <Home />,
//   },
// ];

// export const privateRoutes: Array<PathRouteProps> = [];

// Routes.tsx

// Routes.tsx

import { Routes, Route } from 'react-router-dom';

import Layout from '@/lib/layout';
import Page404 from '@/lib/pages/404'; // Importez votre composant Page404
import Home from '@/lib/pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Game from '../pages/game';
import Settings from '../pages/settings/settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Route index element={<Home />} />
            <Route index element={<Login />} />
            <Route index element={<Profile />} />
            <Route index element={<Game />} />
            <Route index element={<Settings />} />
          </Layout>
        }
      />
      {/* Ajoutez la route Page404 */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;
