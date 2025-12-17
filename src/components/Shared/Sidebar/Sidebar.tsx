import { useState, RefObject } from "react";
import SidebarCard from "./SidebarCard";
import { SidebarItemsData } from "../../../utils/dashboardSidebarData";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaBars, FaTimes } from "react-icons/fa";

interface SidebarProps {
  sidebarRef?: RefObject<HTMLDivElement | null>;
  sidebarMobileStatus?: boolean;
  onMobileToggle?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  sidebarRef,
  sidebarMobileStatus,
  onMobileToggle,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const [activeSidebars, setActiveSidebars] = useState<Record<number, boolean>>(
    {}
  );

  return (
    <div
      ref={sidebarRef}
      className={`overflow-hidden duration-300 ease-in-out bg-[#0B0C10] h-screen text-[#E7EEF8] text-sm font-medium ${
        isCollapsed ? "w-20" : "w-75"
      }`}
    >
      <div>
        {/* Logo and Toggle Icons */}
        <div className="border-b border-[#26272F] px-4 py-4.5">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <Link to="/" className="flex items-center space-x-2">
                <h2
                  className="text-white font-extrabold uppercase text-[17px]"
                  style={{
                    textShadow: "0 2.63px 2.63px rgba(0, 0, 0, 0.44)",
                  }}
                >
                  3js Dashboard
                </h2>
              </Link>
            ) : (
              <div className="w-8"></div> // Spacer for collapsed mode
            )}

            <div className="flex items-center gap-2">
              {/* Mobile Toggle Button */}
              {onMobileToggle && (
                <button
                  onClick={onMobileToggle}
                  className="p-2 rounded-md hover:bg-[#26272F] lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  {sidebarMobileStatus ? (
                    <FaTimes className="w-5 h-5" />
                  ) : (
                    <FaBars className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Desktop Collapse Toggle Button */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-md hover:bg-[#26272F] hidden lg:block"
                  aria-label={
                    isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  {isCollapsed ? (
                    <FaChevronRight className="w-5 h-5" />
                  ) : (
                    <FaChevronLeft className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="px-2 pt-4 h-[calc(100vh-80px)] sidebarScroll overflow-y-auto">
          {SidebarItemsData.map((item) => (
            <SidebarCard
              key={item.id}
              item={item}
              activeSidebars={activeSidebars}
              setActiveSidebars={setActiveSidebars}
              sidebarData={SidebarItemsData}
              onMobileToggle={onMobileToggle}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
