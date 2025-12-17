import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { SidebarItem } from "../../../utils/dashboardSidebarData";

interface SidebarCardProps {
  item: SidebarItem;
  activeSidebars: Record<number, boolean>;
  setActiveSidebars: (sidebars: Record<number, boolean>) => void;
  level?: number;
  parentId?: number | null;
  sidebarData?: SidebarItem[];
  onMobileToggle?: () => void;
  isCollapsed?: boolean;
}

const SidebarCard = ({
  item,
  activeSidebars,
  setActiveSidebars,
  level = 0,
  parentId = null,
  sidebarData = [],
  onMobileToggle,
  isCollapsed = false,
}: SidebarCardProps) => {
  const location = useLocation();

  // Check if the current item or any nested item is active
  const isActive = checkActive(item, location.pathname);

  // Recursive function to check active state
  function checkActive(item: SidebarItem, currentPath: string): boolean {
    if (item.path === currentPath) return true;
    if (item.sub) {
      return item.sub.some((subItem) => checkActive(subItem, currentPath));
    }
    return false;
  }

  // Helper function to find item by ID in the tree
  function findItemById(items: SidebarItem[], id: number): SidebarItem | null {
    for (let item of items) {
      if (item.id === id) return item;
      if (item.sub) {
        const found = findItemById(item.sub, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Recursive function to remove children from active sidebars
  function removeChildrenFromActive(
    item: SidebarItem,
    activeSidebars: Record<number, boolean>
  ): void {
    if (item.sub) {
      item.sub.forEach((child) => {
        delete activeSidebars[child.id];
        removeChildrenFromActive(child, activeSidebars);
      });
    }
  }

  // Handle click to open or close collapsible items
  const handleClick = () => {
    // In collapsed mode, clicking on parent items should expand the sidebar
    if (isCollapsed && hasSubItems && onMobileToggle) {
      // You might want to handle this differently - perhaps expand the sidebar first
      return;
    }

    const newActiveSidebars = { ...activeSidebars };

    if (newActiveSidebars[item.id]) {
      // If already active, close it and all its children
      delete newActiveSidebars[item.id];
      removeChildrenFromActive(item, newActiveSidebars);
    } else {
      // Open this item
      newActiveSidebars[item.id] = true;

      // If this is a top-level item (level 0), close other top-level items
      if (level === 0) {
        // Close all other top-level items
        sidebarData.forEach((topItem) => {
          if (topItem.id !== item.id && topItem.sub) {
            delete newActiveSidebars[topItem.id];
            removeChildrenFromActive(topItem, newActiveSidebars);
          }
        });
      } else if (level === 1 && parentId) {
        // If this is a second-level item, close other items at the same level
        const parentItem = findItemById(sidebarData, parentId);
        if (parentItem && parentItem.sub) {
          parentItem.sub.forEach((sibling) => {
            if (sibling.id !== item.id && sibling.sub) {
              delete newActiveSidebars[sibling.id];
              removeChildrenFromActive(sibling, newActiveSidebars);
            }
          });
        }
      }
    }

    setActiveSidebars(newActiveSidebars);
  };

  // Check if this item has sub-items and should be collapsible
  const hasSubItems = item?.sub && item.sub.length > 0;

  // Check if this item should be clickable (has path and no sub-items)
  const isClickableLink = item.path && !hasSubItems && item.path !== "";

  // Calculate padding based on nesting level (adjust for collapsed mode)
  const paddingLeft = isCollapsed ? 16 : 16 + level * 12;

  // Check if this sidebar item is currently open
  const isOpen = activeSidebars[item.id];

  // In collapsed mode, show only icons with tooltips
  if (isCollapsed && level === 0) {
    return (
      <div className="relative group mb-1">
        {hasSubItems ? (
          // Parent item in collapsed mode
          <button
            onClick={handleClick}
            className={`flex items-center justify-center w-12 h-12 mx-auto my-1 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-[#111217] text-white"
                : "text-[#b5b7c8] hover:bg-[#111217] hover:text-white"
            }`}
          >
            <item.Icon size={20} />

            {/* Tooltip for collapsed mode - improved positioning */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-[#1E1F29] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-[#26272F] pointer-events-none">
              {item.name}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1E1F29] transform rotate-45 border-l border-t border-[#26272F]"></div>
            </div>
          </button>
        ) : isClickableLink ? (
          // Link item in collapsed mode
          <Link to={item.path} onClick={onMobileToggle} className="block">
            <div
              className={`flex items-center justify-center w-12 h-12 mx-auto my-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#111217] text-white"
                  : "text-[#b5b7c8] hover:bg-[#111217] hover:text-white"
              }`}
            >
              <item.Icon size={20} />

              {/* Tooltip for collapsed mode - improved positioning */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-[#1E1F29] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-[#26272F] pointer-events-none">
                {item.name}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1E1F29] transform rotate-45 border-l border-t border-[#26272F]"></div>
              </div>
            </div>
          </Link>
        ) : (
          // Disabled item in collapsed mode
          <div className="flex items-center justify-center w-12 h-12 mx-auto my-1 rounded-lg opacity-50 cursor-not-allowed">
            <item.Icon size={20} />

            {/* Tooltip for collapsed mode - improved positioning */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-[#1E1F29] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-[#26272F] pointer-events-none">
              {item.name}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1E1F29] transform rotate-45 border-l border-t border-[#26272F]"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal expanded mode
  return (
    <div className="mb-1">
      {hasSubItems ? (
        <div>
          {/* Parent item with collapsible sub-items */}
          <button
            onClick={handleClick}
            className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 ease-out ${
              isActive
                ? "bg-[#111217] text-white"
                : "text-[#b5b7c8] hover:bg-[#111217] hover:text-white"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-colors duration-200`}>
                <item.Icon size={20} />
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium capitalize whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </div>

            {!isCollapsed && hasSubItems && (
              <FaChevronRight
                size={14}
                className={`transition-all duration-300 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            )}
          </button>

          {/* Collapsible section for sub-items (only show in expanded mode) */}
          {!isCollapsed && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "max-h-125 opacity-100 mt-1" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className="border-l border-[#26272F] ml-6"
                style={{ marginLeft: `${paddingLeft + 8}px` }}
              >
                {item.sub
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((subItem) => (
                    <SidebarCard
                      key={subItem.id}
                      item={subItem}
                      activeSidebars={activeSidebars}
                      setActiveSidebars={setActiveSidebars}
                      level={level + 1}
                      parentId={item.id}
                      sidebarData={sidebarData}
                      onMobileToggle={onMobileToggle}
                      isCollapsed={isCollapsed}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : isClickableLink ? (
        // Single item with actual path - direct link
        <Link to={item.path} onClick={onMobileToggle} className="block">
          <div
            className={`flex items-center p-3 rounded-lg transition-all duration-200 ease-out ${
              isActive
                ? "bg-[#111217] text-white"
                : "text-[#b5b7c8] hover:bg-[#111217] hover:text-white"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center gap-3">
              <span className="transition-colors duration-200">
                <item.Icon size={20} />
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium capitalize whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div
          className={`flex items-center p-3 rounded-lg opacity-50 cursor-not-allowed`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[#3A3B44]">
              <item.Icon size={20} />
            </span>
            {!isCollapsed && (
              <span className="text-sm text-[#b5b7c8] capitalize whitespace-nowrap">
                {item.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarCard;
