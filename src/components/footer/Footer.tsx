

const Footer = () => {
  return (
    <div className="w-full h-40 bg-slate-950/10 backdrop-blur-md flex justify-between items-center border-t-2 border-slate-700 p-5 relative">
      <div>
        <div className="flex rounded justify-between w-30">
          <button className="text-2xl text-slate-300">
            <i className="ri-linkedin-fill"></i>
          </button>
          <button className="text-2xl text-slate-300">
            <i className="ri-instagram-line"></i>
          </button>
          <button className="text-2xl text-slate-300">
            <i className="ri-github-line"></i>
          </button>
        </div>
      </div>

      <div>
        <p className="text-gray-400">
          Made by Sujon Ganguly with curiosity & chai @2026
        </p>
      </div>
    </div>
  );
};

export default Footer;
