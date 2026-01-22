import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;