import Timeline from "./about-prev-components/Timeline";

const AboutPrev = () => {
  return (
    <div className="w-full h-dvh z-50 flex justify-evenly relative">
      <div className="h-full w-1/2 pt-20 flex flex-col gap-30 pl-10">
        <div className="h-1/2 w-full pt-6 pl-12">
          <h1 className="font-grotesk text-7xl text-slate-200 font-bold w-full">
            Who I am
          </h1>
          <p className="text-l font-poppins text-slate-400 text-justify pt-10 w-3/4">
            I'm an aspiring AI/ML Engineer and Full-Stack Developer who loves turning ambitious ideas into real, deployed products. My work spans AI/ML, RAG, full-stack development, and data science — with a toolkit built around Python, React, FastAPI, LangChain, and SQL. Always learning, always experimenting, and always up for connecting with fellow builders and researchers. Let's create something worth talking about.
          </p>
        </div>
        <a href="/about" className="w-50 border-gray-600 border p-3 rounded-full px-5 bg-slate-950/40 cursor-pointer backdrop-blur-md text-slate-400 hover:bg-slate-300 hover:text-slate-950 transition-color duration-600 ease-in-out font-poppins ml-10 mt-15">
          Learn More
        </a>
      </div>
      <div className="w-1/2 overflow-x-hidden h-full overflow-y-hidden">
        <Timeline />
        <button className="-translate-y-33 translate-x-10 sticky border-gray-600 border p-2 px-4 bg-slate-950/40 cursor-pointer backdrop-blur-md text-slate-400 hover:bg-slate-300 hover:text-slate-950 transition-color duration-600 ease-in-out font-poppins text-sm">
          Skip Timeline
        </button>
      </div>
    </div>
  );
};

export default AboutPrev;
