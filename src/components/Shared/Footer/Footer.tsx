const Footer = () => {
  const fullYear = new Date().getFullYear();

  return (
    <>
      <div className="w-full p-4  text-center border-l border-l-[#131517]">
        <p className="text-[10px] md:text-sm text-secondary-base">
          &copy; Copyrights{" "}
          <span className="text-blue-500">Three.js Dashboard</span> {fullYear}.
          All right reserved. Designed by{" "}
          <span className="text-[#0064F7]">Zamirul Kabir</span>
        </p>
      </div>
    </>
  );
};

export default Footer;
