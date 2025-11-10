import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const Layout = () => {
  // App-level state that can be shared via outlet context
  const appState = {
    // Add any app-level state here that needs to be shared
    // Example: user preferences, theme, global settings
  };

  // App-level methods that can be shared via outlet context  
  const appMethods = {
    // Add any app-level methods here that need to be shared
    // Example: global handlers, utility functions
  };

  const outletContext = {
    ...appState,
    ...appMethods,
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:block" />
      
      {/* Mobile Navigation */}
      <MobileNav />
      
{/* Main Content */}
      <div className="lg:ml-64 pt-20 lg:pt-0">
        <main className="p-6">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
};

export default Layout;