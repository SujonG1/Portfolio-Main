
import AiFace2 from "./ai-face2";

const aiUi = () => {
  return (
    <div className="flex flex-col justify-center items-center fixed bottom-20 z-1000">
      <div className='absolute bottom-87 z-50'>
        <AiFace2 />
      </div>
      <div className="h-100 w-70 bg-gradient-to-tr from-sky-400/15 to-purple-800/15 backdrop-blur-xs rounded-2xl border-0.5 border-white/10">
        
      </div>
    </div>
  );
};

export default aiUi;
