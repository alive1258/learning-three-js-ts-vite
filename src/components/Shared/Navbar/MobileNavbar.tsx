import { BiMenu, BiMenuAltLeft } from "react-icons/bi";
import { PiXCircleDuotone } from "react-icons/pi";

interface MobileNavbarProps {
  navbar: boolean;
  setNavbar: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  navbar,
  setNavbar,
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <div className="flex lg:hidden items-center justify-between w-full px-6 py-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-white"
      >
        {sidebarOpen ? <PiXCircleDuotone size={24} /> : <BiMenu size={24} />}
      </button>
      <button onClick={() => setNavbar(!navbar)} className="text-white">
        <BiMenuAltLeft size={24} />
      </button>
    </div>
  );
};

export default MobileNavbar;
