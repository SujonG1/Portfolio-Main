import { useRef } from "react";
import { useIntroAnimation } from "../../../../animations/animation-components/Intro";

const Social = () => {

  const container = useRef<HTMLDivElement>(null!);

  useIntroAnimation(container)

  return (
    <div className="social-body w-15 h-70 absolute bg-gradient-to-tr from-sky-400 to-purple-800 backdrop-blur-md top-1/8 right-10 rounded-2xl flex justify-center items-center z-50"
    ref={container}>
      <div className="bg-slate-950/70 backdrop-blur-md h-67 w-12 rounded-2xl flex flex-col justify-between p-4 text-2xl items-center text-slate-400 z-500">
        <a 
        href="https://www.linkedin.com/in/sujon-ganguly-0bb22631a/" 
        target="_blank"
         className="social-btn absolute z-1000 relative group cursor-pointer text-slate-400 transition-all duration-300 ease-in-out hover:scale-125">
          <i
           className="ri-linkedin-fill transition-colors duration-300 text-transparent bg-gradient-to-tr from-white to-white bg-clip-text hover:from-sky-500 hover:to-purple-800"></i>
        </a>
        <a
        href="https://www.instagram.com/sujonganguly01/"
        target="_blank"
        className="social-btn group relative cursor-pointer text-slate-400 transition-all duration-300 ease-in-out hover:scale-125"
        >
          <i className="ri-instagram-fill transition-colors duration-300 text-transparent bg-gradient-to-tr from-white to-white bg-clip-text hover:from-sky-500 hover:to-purple-800"></i>
        </a>
        <a 
        href=""
        target="_blank"
        className="social-btn group relative cursor-pointer text-slate-400 transition-all duration-300 ease-in-out hover:scale-125">
          <i className="ri-github-fill transition-colors duration-300 text-transparent bg-gradient-to-tr from-white to-white bg-clip-text hover:from-sky-500 hover:to-purple-800"></i>
        </a>
        <a 
        href=""
        target="_blank"
        className="social-btn group relative cursor-pointer text-slate-400 transition-all duration-300 ease-in-out hover:scale-125">
          <i className="ri-mail-fill transition-colors duration-300 text-transparent bg-gradient-to-tr from-white to-white bg-clip-text hover:from-sky-500 hover:to-purple-800"></i>
        </a>
        <a 
        href=""
        target="_blank"
        className="social-btn group relative cursor-pointer text-slate-400 transition-all duration-300 ease-in-out hover:scale-125">
          <i className="ri-phone-fill transition-colors duration-300 text-transparent bg-gradient-to-tr from-white to-white bg-clip-text hover:from-sky-500 hover:to-purple-800"></i>
        </a>
      </div>
    </div>
  );
};

export default Social;