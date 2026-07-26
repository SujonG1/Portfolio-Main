

const AiFace1 = () => {
  return (
    <div className="relative h-25 w-25 rounded-full bg-gradient-to-tr from-sky-400 to-purple-800 flex justify-center items-center [mask-image:radial-gradient(circle_40px,transparent_calc(100%_-_1px),black_100%)]">
      <div className="absolute h-20 w-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center gap-2 relative">
        <div className="flex justify-between gap-2.5">
          <div className="h-5 w-3 bg-white rounded-full flex justify-center items-center"> 
            <div className="h-3 w-2 bg-gradient-to-tr from-slate-900 to-purple-800 rounded-full"></div>
          </div>
          <div className="h-5 w-3 bg-white rounded-full flex justify-center items-center">
            <div className="h-3 w-2 bg-gradient-to-tr from-slate-900 to-purple-800 rounded-full"></div>
          </div>
        </div>
        <div className="w-7 h-3 rounded-b-full bg-gradient-to-tr from-red-400 to-red-800 mt-1"></div>
      </div>
    </div>
  );
};

export default AiFace1;
