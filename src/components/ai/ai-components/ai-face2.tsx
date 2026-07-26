

const AiFace2 = () => {
  return (
    <div className="relative h-25 w-25 rounded-full bg-gradient-to-tr from-sky-400 to-purple-800 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-2.5">
        <div className="flex justify-between gap-2.5">
          <div className="h-9 w-5 bg-white rounded-full flex justify-center items-center">
            <div className="h-5 w-3 bg-gradient-to-tr from-slate-900 to-purple-800 rounded-full"></div>
          </div>
          <div className="h-9 w-5 bg-white rounded-full flex justify-center items-center">
            <div className="h-5 w-3 bg-gradient-to-tr from-slate-900 to-purple-800 rounded-full"></div>
          </div>
        </div>
        <div className="w-11 h-5 rounded-b-full bg-gradient-to-tr from-red-400 to-red-800 mt-1"></div>
      </div>
    </div>
  );
};

export default AiFace2;
