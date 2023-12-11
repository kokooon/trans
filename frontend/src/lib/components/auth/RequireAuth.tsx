import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

type PrivateRouteProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

const RequireAuth = ({ children, redirectTo = '/login' }: PrivateRouteProps) => {
  // Utiliser react-cookie pour obtenir le cookie
  console.log(children)
  let isAuthenticated = false;
  const cookies = useCookies(['userToken']);
  if (cookies)
    isAuthenticated = true;
  return isAuthenticated ? (
    <Navigate to="/" replace={true} />
  ) : (
    <Navigate to={redirectTo} />
  );
};

export default RequireAuth;
