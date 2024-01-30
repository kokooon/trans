import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Page404 from '@/lib/pages/404';
import Home from '@/lib/pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Settings from '../pages/settings/settings';
import Social from '../pages/social/social';
import TwoFa from '../pages/2fa/TwoFa';
import Game from '../pages/game/game';

const Routings = () => {
  return (
    <Suspense>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/social" element={<Social />} />
        <Route path="/2fa" element={<TwoFa />} />
        <Route path="/game" element={<Game />} />
        {/* Route 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default Routings;
