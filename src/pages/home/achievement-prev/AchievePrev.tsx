import { useState } from "react";
import Certifications from "./achievePrev Components/Certifications";

const getPillTiming = (index: number, skill: string) => {
  const seed = (index * 37 + skill.length * 13) % 100;
  const duration = (3.5 + (seed % 30) / 10).toFixed(1);
  const delay = (((seed * 7) % 40) / 10).toFixed(1);

  return {
    duration: `${duration}s`,
    delay: `${delay}s`,
  };
};

const AchievePrev = () => {
  const [skills] = useState([
    "Python", 
    "C", 
    "Java", 
    "C++", 
    "React", 
    "TypeScript", 
    "CSS",
    "Power Bi",
    "LangChain",
    "LangGraph",
    "GSAP",
    "HTML",
    "JavaScript",
    "Tailwind CSS",
    "MS Office"
  ]);

  return (
    <div className="w-full h-dvh relative bg-transparent z-50 grid grid-cols-2 overflow-hidden">
      <style>{`
        @keyframes ambientShine {
          0%, 65%, 100% {
            box-shadow: 0 0 0px rgba(56, 189, 248, 0);
            border-color: rgba(255, 255, 255, 0.1);
            color: rgb(203, 213, 225);
            text-shadow: none;
          }
          30% {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
            border-color: rgba(56, 189, 248, 0.7);
            color: #ffffff;
            text-shadow: 0 0 12px rgba(255, 255, 255, 0.9);
          }
        }

        @keyframes glossSweep {
          0%, 65%, 100% {
            left: -100%;
          }
          30% {
            left: 200%;
          }
        }

        .ambient-pill {
          animation-name: ambientShine;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        /* Pause keyframe animations on hover so scale and shadow effects render cleanly */
        .ambient-pill:hover,
        .ambient-pill:hover .light-beam {
          animation-play-state: paused;
        }

        .ambient-pill .light-beam {
          animation-name: glossSweep;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>

      <div className="w-full h-full py-28 pl-12">
        <div className="mb-10">
          <h1 className="font-grotesk text-7xl text-slate-200 font-bold">
            Skills
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {skills.map((skill, index) => {
            const timing = getPillTiming(index, skill);

            return (
              <div 
                key={skill} 
                style={{
                  animationDuration: timing.duration,
                  animationDelay: timing.delay,
                }}
                className="ambient-pill relative overflow-hidden px-4 py-1.5 border border-white/10 rounded-full bg-linear-to-tr from-sky-400/30 to-purple-800/30 backdrop-blur-md text-slate-300 font-poppins text-base cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.15] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:border-sky-400/80 hover:text-white hover:[text-shadow:0_0_12px_rgba(255,255,255,0.9)]"
              >
                <div 
                  style={{
                    animationDuration: timing.duration,
                    animationDelay: timing.delay,
                  }}
                  className="light-beam absolute top-0 w-1/2 h-full bg-linear-to-tr from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
                />

                <span className="relative z-10">{skill}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full h-full">
        <Certifications />
      </div>
    </div>
  );
};

export default AchievePrev;