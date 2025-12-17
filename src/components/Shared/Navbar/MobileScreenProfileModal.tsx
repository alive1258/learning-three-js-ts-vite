import { User } from "./Navbar";
import NavbarSearch from "./NavbarSearch";

interface MobileScreenProfileModalProps {
  user: User;
}

const MobileScreenProfileModal: React.FC<MobileScreenProfileModalProps> = ({
  user,
}) => {
  return (
    <div className="lg:hidden bg-[#1a1b1f] border-t border-[#26272F] p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>
      <NavbarSearch />
      <div className="mt-4 space-y-2">
        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#26272F] rounded transition-colors">
          Profile
        </button>
        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#26272F] rounded transition-colors">
          Settings
        </button>
        <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#26272F] rounded transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileScreenProfileModal;
