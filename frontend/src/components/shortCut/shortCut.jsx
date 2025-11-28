import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './shortCut.css';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/update-profile' ||
    location.pathname === '/projects' ||
    location.pathname.startsWith('/dashboard/projects/')
  ) {
    return null;
  }

  return (
    <nav className="breadcrumb">
      <Link to="/">home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <span key={to}>{decodeURIComponent(value)}</span>
        ) : (
          <Link key={to} to={to}>
            {decodeURIComponent(value)}
          </Link>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;