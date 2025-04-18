import React, {useState, useEffect} from "react";
import classNames from "classnames";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/sidebar";

const DashboardLayout = ({title, container, ...props}) => {
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [sidebarVisibility, setSidebarVisibility] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);

  useEffect(() => {
    sidebarVisibility ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
  }, [sidebarVisibility])
  

  useEffect(() => {
    const handleMobileSidebar = () => {
        if (window.innerWidth < 1200) {
          setSidebarMobile(true);
        } else {
          setSidebarMobile(false);
          setSidebarVisibility(false)
        }
    }

    handleMobileSidebar();
    window.addEventListener('resize', handleMobileSidebar);
    return () => {
      window.removeEventListener('resize', handleMobileSidebar);
    };
  }, []);

  const containerClass = classNames({
    "container" : true,
    "max-w-none" : !container
  })

  return (
    <div className="min-h-screen flex">
     <Sidebar mobile={sidebarMobile} visibility={sidebarVisibility} setVisibility={setSidebarVisibility} compact={sidebarCompact} setCompact={setSidebarCompact} />
      <main className="flex-1  bg-gray-50">
        <nav className="h-[64px] w-full bg-gray-950 border-b dark:border-gray-900">
        </nav>
        <div className="p-5">
        <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
