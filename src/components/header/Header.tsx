
import HeadMain from "./head-components/HeadMain";
import HeadScroll from "./head-components/HeadScroll";

const Navbar = () => {
  return (
    <div className="flex flex-col fixed top-0 w-full z-1000">
      <HeadScroll />
      <HeadMain />
    </div>
  );
};

export default Navbar;
