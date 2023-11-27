//Routings.tsx
/**
 * @note
 * for hook alternative of route element composition:
 * - https://reactrouter.com/docs/en/v6/upgrading/v5#use-useroutes-instead-of-react-router-config
 * - https://reactrouter.com/docs/en/v6/examples/route-objects
 *
 * might need to take notes on:
 * - https://reactrouter.com/docs/en/v6/upgrading/v5#note-on-link-to-values
 */

// import { Suspense } from 'react';
// import { Routes, Route } from 'react-router-dom';

// import RequireAuth from '@/lib/components/auth/RequireAuth';
// import Page404 from '@/lib/pages/404';

// import { routes, privateRoutes } from './routes';

// const Routings = () => {
//   return (
//     <Suspense>
//       <Routes>
//         {routes.map((routeProps) => (
//           <Route {...routeProps} key={routeProps.path as string} />
//         ))}
//         {privateRoutes.map(({ element, ...privateRouteProps }) => (
//           <Route
//             element={
//               <RequireAuth
//                 redirectTo={`/login?redirectTo=${privateRouteProps.path}`}
//               >
//                 {element}
//               </RequireAuth>
//             }
//             {...privateRouteProps}
//             key={`privateRoute-${privateRouteProps.path}`}
//           />
//         ))}
//         <Route path="*" element={<Page404 />} />
//       </Routes>
//     </Suspense>
//   );
// };

// export default Routings;

import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import RequireAuth from '@/lib/components/auth/RequireAuth';
import Page404 from '@/lib/pages/404';
import Home from '@/lib/pages/home';

// Importez vos composants de page


const Routings = () => {
  return (
    <Suspense>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />

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

