import { useState } from "react";

interface NavbarSearchProps {
  onSearch?: (query: string) => void;
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="bg-[#1a1b1f] border border-[#26272F] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#3a3b44] w-64"
      />
    </div>
  );
};

export default NavbarSearch;
