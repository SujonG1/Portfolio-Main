import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About"
import ParticleBackground from "./components/particles/Particle";


const App = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden ">
      <ParticleBackground />
      <header>
        <Header />
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer>
        <Footer />
      </footer>
      
    </div>
  );
};

export default App;
