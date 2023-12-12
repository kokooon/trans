import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import RequireAuth from '@/lib/components/auth/RequireAuth';
import Page404 from '@/lib/pages/404';
import Home from '@/lib/pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Settings from '../pages/settings/settings';
import Game from '../pages/game';

const Routings = () => {
  return (
    <Suspense>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/game" element={<Game />} />

        {/* Routes privées */}
        <Route
          path="/private"
          element={
            <RequireAuth redirectTo="/">
              <Route path="/" element={<Home />} />
            </RequireAuth>
          }
        />

        {/* Route 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default Routings;
