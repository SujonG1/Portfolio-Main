import Timeline from "./about-prev-components/Timeline";

const AboutPrev = () => {
  return (
    <div className="w-full h-dvh z-50 flex justify-evenly relative">
      <div className="h-full w-1/2 p-10 flex flex-col gap-30">
        <div className="h-1/2 w-full pt-6 pl-12">
          <h1 className="font-grotesk text-7xl text-slate-200 font-bold w-full">
            Who I am
          </h1>
          <p className="text-lg font-poppins text-slate-400 text-justify pt-10 w-3/4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            voluptatibus reiciendis impedit, non esse quibusdam rerum corrupti
            architecto asperiores autem blanditiis, vero fugit id? Suscipit cum
            omnis facere perferendis veritatis.
          </p>
        </div>
      </div>
      <div className="w-1/2 overflow-x-hidden h-full">
        <Timeline />
      </div>
    </div>
  );
};

export default AboutPrev;
