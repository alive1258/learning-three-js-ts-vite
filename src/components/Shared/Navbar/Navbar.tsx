import { BiBell, BiMessageSquare, BiMoon } from "react-icons/bi";
import MobileNavbar from "./MobileNavbar";
import NavbarSearch from "./NavbarSearch";
import Profile from "./Profile";
import MobileScreenProfileModal from "./MobileScreenProfileModal";
import { useState } from "react";

export type User = {
  name: string;
  email: string;
};

const Navbar: React.FC = () => {
  const [navbar, setNavbar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user: User = {
    name: "Zamirul Kabir",
    email: "zamirulkabir999@gmail.com",
  };

  return (
    <>
      <div className="w-full top-0 sticky z-50 border-b border-[#26272F] bg-[#0B0C10]">
        <div className="w-full">
          {/* Mobile navbar */}
          <div className="lg:hidden w-full">
            <MobileNavbar
              navbar={navbar}
              setNavbar={setNavbar}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>

          {/* Desktop navbar */}
          <div className="hidden lg:block w-full">
            <div className="flex items-center justify-between w-full px-6 py-4">
              {/* Left side - Search box */}
              <div className="flex-1 max-w-md">
                <NavbarSearch />
              </div>

              {/* Right side items */}
              <div className="flex items-center gap-6">
                {/* Country flag */}
                <button className="w-10 h-10 rounded-full flex justify-center items-center border border-[#26272F] bg-[#1a1b1f] hover:border-[#3a3b44] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_1_1008)">
                      <mask
                        id="mask0_1_1008"
                        style={{ maskType: "luminance" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <path
                          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                          fill="white"
                        />
                      </mask>
                      <g mask="url(#mask0_1_1008)">
                        <path
                          d="M14.625 0H24V24H0V12.7969L14.625 0Z"
                          fill="#D80027"
                        />
                        <path
                          d="M13.125 1.92188V3.75H24V1.92188H13.125ZM13.125 5.57812V7.40625H24V5.57812H13.125ZM13.125 9.23438V11.0625H24V9.23438H13.125ZM0 12.8906V14.7188H24V12.8906H14.625L7.3125 9.89062L0 12.8906ZM0 16.5469V18.375H24V16.5469H0ZM0 20.2031V22.0312H24V20.2031H0Z"
                          fill="#EEEEEE"
                        />
                        <path d="M0 0H14.625V12.8906H0V0Z" fill="#0052B4" />
                        <path
                          d="M12.1875 8.25L12.2812 9.04688L11.5781 9.32812L12.3281 9.51562L12.375 10.2656L12.7969 9.60938L13.5469 9.75L13.0312 9.1875L13.4062 8.53125L12.7031 8.85938L12.1875 8.25ZM5.4375 8.25L4.92188 8.8125L4.21875 8.53125L4.59375 9.1875L4.07812 9.75L4.875 9.60938L5.25 10.2656L5.29688 9.51562L6.04688 9.32812L5.34375 9.04688L5.4375 8.25ZM13.5469 6.04688L13.0781 6.65625L12.375 6.42188L12.7969 7.03125L12.375 7.64062L13.0781 7.40625L13.5469 8.01562V7.26562L14.25 7.03125L13.5469 6.79688V6.04688ZM4.125 6.04688V6.79688L3.375 7.03125L4.125 7.26562V8.01562L4.54688 7.40625L5.29688 7.64062L4.82812 7.03125L5.29688 6.42188L4.54688 6.65625L4.125 6.04688ZM12.4219 3.79688L12.3281 4.54688L11.5781 4.73438L12.2812 5.01562L12.1875 5.8125L12.7031 5.25L13.4062 5.53125L13.0312 4.875L13.5469 4.3125L12.7969 4.45312L12.4219 3.79688ZM5.25 3.79688L4.875 4.45312L4.07812 4.3125L4.59375 4.875L4.21875 5.53125L4.92188 5.25L5.4375 5.8125L5.34375 5.01562L6.04688 4.73438L5.29688 4.54688L5.25 3.79688ZM11.5312 2.29688L10.9688 2.8125L10.3125 2.4375L10.6406 3.14062L10.0312 3.65625L10.8281 3.5625L11.1094 4.26562L11.2969 3.51562L12.0469 3.46875L11.3906 3.09375L11.5312 2.29688ZM6.09375 2.29688L6.23438 3.04688L5.57812 3.46875L6.32812 3.51562L6.51562 4.26562L6.84375 3.5625L7.59375 3.65625L7.03125 3.14062L7.3125 2.4375L6.65625 2.8125L6.09375 2.29688ZM8.8125 1.59375L8.57812 2.29688H7.82812L8.4375 2.76562L8.20312 3.46875L8.8125 3.04688L9.42188 3.46875L9.1875 2.76562L9.79688 2.29688H9.04688L8.8125 1.59375ZM11.5312 11.7656L10.9688 11.25L10.3125 11.625L10.6406 10.9219L10.0312 10.4062L10.8281 10.5L11.1094 9.79688L11.2969 10.5469L12.0469 10.5938L11.3906 10.9688L11.5312 11.7656ZM6.09375 11.7656L6.23438 11.0156L5.57812 10.5938L6.32812 10.5469L6.51562 9.79688L6.84375 10.5L7.59375 10.4062L7.03125 10.9219L7.3125 11.625L6.65625 11.25L6.09375 11.7656ZM8.8125 12.4688L8.57812 11.7656H7.82812L8.4375 11.2969L8.20312 10.5938L8.8125 11.0156L9.42188 10.5938L9.1875 11.2969L9.79688 11.7656H9.04688L8.8125 12.4688Z"
                          fill="#EEEEEE"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_1_1008">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>

                {/* Dark mode toggle */}
                <button className="w-10 h-10 rounded-full flex justify-center items-center border border-[#26272F] bg-[#1a1b1f] hover:border-[#3a3b44] transition-colors">
                  <BiMoon className="text-white/70" size={20} />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button className="w-10 h-10 border border-[#26272F] rounded-full flex justify-center items-center bg-[#1a1b1f] hover:border-[#3a3b44] transition-colors">
                    <BiBell className="text-white/70" size={20} />
                  </button>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white bg-[#FF4234] text-xs flex items-center justify-center">
                    2
                  </span>
                </div>

                {/* Messages */}
                <div className="relative">
                  <button className="w-10 h-10 border border-[#26272F] rounded-full flex justify-center items-center bg-[#1a1b1f] hover:border-[#3a3b44] transition-colors">
                    <BiMessageSquare className="text-white/70" size={20} />
                  </button>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white bg-[#0064F7] text-xs flex items-center justify-center">
                    5
                  </span>
                </div>

                {/* Profile */}
                <Profile user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile profile modal */}
      <div className="w-full overflow-hidden">
        {navbar && <MobileScreenProfileModal user={user} />}
      </div>
    </>
  );
};

export default Navbar;
