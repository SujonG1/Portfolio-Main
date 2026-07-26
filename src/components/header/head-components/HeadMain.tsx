import {useRef} from "react";
import { Link } from "react-router-dom";
import { useIntroAnimation } from "../../../animations/animation-components/Intro";
import myImage from "../../../assets/images/Untitled.jpg"


const NavMain = () => {

  const container = useRef<HTMLDivElement>(null!);

  useIntroAnimation(container)

  return (
    <div className="flex justify-between bg-slate-950/10 backdrop-blur-md w-full h-17 p-4"
    ref={container}>
      <div className="flex justify-between text-4xl font-bold items-center bg-gradient-to-r from-sky-600 to-purple-800 bg-clip-text text-transparent opacity-100 nav-logo" >
        <img
          src={myImage}
          className="w-10 h-10 object-cover rounded-full cursor-pointer"
        />
        <Link to="/" className="ml-5 pb-1 cursor-pointer font-anta">
          sujon.dev
        </Link>
      </div>
      <div className="text-slate-400 flex items-center font-roboto gap-5">
        <Link to="/about" className="nav-link group p-3 text-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300 ease-in-out relative">
          About
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full">
          </div>
        </Link>
        <Link to="/projects"  className="nav-link group p-3 text-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300 ease-in-out relative">
          Projects
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full">
          </div>
        </Link>
        <Link to="/lab" className="nav-link group p-3 text-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300 ease-in-out relative">
          Lab
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full">
          </div>
        </Link>
        <Link to="/blog" className="nav-link group p-3 text-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300 ease-in-out relative">
          Blog
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full">
          </div>
        </Link>
        <Link to="/achievements" className="nav-link group p-3 text-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300 ease-in-out relative">
          Achievements
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full">
          </div>
        </Link>
        <Link to="/contact" className="nav-link group p-3 text-lg text-slate-400 hover:text-cyan-400 transition-colors duration-300 ease-in-out relative">
          Contact
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full">
          </div>
        </Link>
      </div>
      <div className="flex justify-between items-center gap-5 flex-wrap">
        <button className="nav-btn px-4 py-2 rounded-full text-slate-300 text-sm cursor-pointer flex items-center gap-2 border border-gray-600 whitespace-nowrap hover:text-slate-900 hover:bg-slate-300 transition-colors duration-600 ease-in-out">
          <i className="ri-download-line"></i>
          <span>Resume</span>
        </button>

        <button className="nav-btn px-6 h-10 bg-linear-to-tr from-sky-600 to-purple-800 text-white text-l font-semibold font-poppins rounded-xl cursor-pointer hover:from-purple-800 hover:to-sky-600 transition-colors duration-600 ease-in-out">
          Hire Me
        </button>
      </div>
    </div>
  );
};

export default NavMain;