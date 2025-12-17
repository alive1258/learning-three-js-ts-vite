// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Shared/Navbar/Navbar";
// import Footer from "../components/Shared/Footer/Footer";
// import Sidebar from "../components/Shared/Sidebar/Sidebar";

// const MainLayout = () => {
//   return (
//     <>
//       <div className="bg-[#0D0E12] text-[#b5b7c8]">
//         <div className="flex items-start lg:gap-1 duration-300">
//           <div>
//             <div className="border-r border-[#26272F]"></div>
//             <div className="hidden lg:block">
//               <Sidebar />
//             </div>
//           </div>

//           <div className="w-full min-h-screen flex flex-col">
//             <Navbar />
//             <div className="grow min-h-62.5">
//               {" "}
//               <Outlet />
//             </div>
//             <Footer />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MainLayout;

import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Shared/Navbar/Navbar";
import Footer from "../components/Shared/Footer/Footer";
import Sidebar from "../components/Shared/Sidebar/Sidebar";
import { FaBars } from "react-icons/fa";

const MainLayout = () => {
  // State for mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State for desktop collapsed/expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Toggle mobile sidebar
  const handleMobileToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Toggle desktop collapse/expand
  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileSidebarOpen
      ) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  return (
    <>
      <div className="bg-[#0D0E12] text-[#b5b7c8]">
        <div className="flex items-start lg:gap-1 duration-300">
          {/* Mobile Overlay */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={handleMobileToggle}
            />
          )}

          {/* Sidebar Container */}
          <div
            className={`fixed lg:relative z-50 transform ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-300`}
          >
            <div className="border-r border-[#26272F]">
              <Sidebar
                sidebarRef={sidebarRef}
                sidebarMobileStatus={isMobileSidebarOpen}
                onMobileToggle={handleMobileToggle}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div
            className={`w-full min-h-screen flex flex-col transition-all duration-300 `}
          >
            {/* Mobile Toggle Button in Navbar area */}
            <div className="lg:hidden px-4 pt-4">
              <button
                onClick={handleMobileToggle}
                className="p-2 rounded-md bg-[#26272F] hover:bg-[#3A3B45]"
                aria-label="Open sidebar"
              >
                <FaBars className="w-5 h-5" />
              </button>
            </div>

            <Navbar />

            <div className="grow min-h-62.5 px-4 lg:px-6">
              <Outlet />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
