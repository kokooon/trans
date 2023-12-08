import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import RequireAuth from '@/lib/components/auth/RequireAuth';
import Page404 from '@/lib/pages/404';
import Home from '@/lib/pages/home';
import Login from '../pages/login';
import Game from '@/lib/pages/game';
import Profile from '@/lib/pages/profile';

const Routings = () => {
  return (
    <Suspense>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        {/* Routes privées */}
        <Route
          path="/private"
          element={
            <RequireAuth redirectTo="/login">
              {/* Composant de la page privée */}
              <div>Contenu de la page privée</div>
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
