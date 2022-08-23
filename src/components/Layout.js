import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return <main>
    <header>
      <nav>
        <ul>
          <li><Link to={''} />Home</li>
        </ul>
      </nav>
    </header>
    <Outlet />
  </main>;
}
