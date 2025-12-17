import { useState } from "react";
import { User } from "./Navbar";

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0)}
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1b1f] border border-[#26272F] rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-[#26272F]">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#26272F] transition-colors">
            Profile
          </button>
          <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#26272F] transition-colors">
            Settings
          </button>
          <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#26272F] transition-colors">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
