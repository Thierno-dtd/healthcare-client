import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import {useUIStore} from "@/store/ui.store.ts";
import {PAGE_TITLES} from "@core/utils/constants.ts";


const MainLayout: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();

  const getPageTitle = (): string => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const path = pathParts.join('/');
    return PAGE_TITLES[path] || 'LAMESSE DAMA';
  };

  return (
    <div id="app-page">
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <TopBar pageTitle={getPageTitle()} onMenuToggle={toggleSidebar} />
          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
