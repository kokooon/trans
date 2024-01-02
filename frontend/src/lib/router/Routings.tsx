import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Page404 from '@/lib/pages/404';
import Home from '@/lib/pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Settings from '../pages/settings/settings';

const Routings = () => {
  return (
    <Suspense>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Route 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default Routings;
