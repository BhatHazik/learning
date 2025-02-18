import { useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Sidebar } from "../Sidebar/Sidebar";
import SmallerScreenNavbar from "../SmallerScreenNavbar/SmallerScreenNavbar";
import SmallerScreenSidebar from "../SmallerScreenSidebar/SmallerScreenSidebar";

import "./Layout.css";

export const Layout = ({ children, search, setSearch, cartItemNumber }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };
  // localStorage.removeItem("role");
  return (
    <>
      <div className="layout position-relative app-smooth-white">
        <div className="responsive-md">
          <SmallerScreenNavbar 
          collapsed={collapsed}
          search={search}
          setSearch={setSearch}
          cartItemNumber={cartItemNumber}
          />
        </div>
        <div className="responsive-lg w-100" style={{background: '#FAF9F6'}}>
          <Navbar
            collapsed={collapsed}
            search={search}
            setSearch={setSearch}
            cartItemNumber={cartItemNumber}
          />
        </div>
        <div className="responsive-lg">
          <Sidebar collapsed={collapsed} handleToggle={handleToggle} />
        </div>
        <main className={`content ${collapsed ? "collapsed" : ""}`}>
          {children}
        </main>
        <div style={{top:"100%", position:"fixed"}} className="responsive-md ">
          <SmallerScreenSidebar />
        </div>
      </div>
    </>
  );
};
