
import Hero from './hero/Hero'
import AboutPrev from './about-prev/AboutPrev'
import AchievePrev from './achievement-prev/AchievePrev'

const Home = () => {
  return (
    <div className='w-full h-full bg-slate-950'>
      <Hero />
      <AboutPrev />
      <AchievePrev />
    </div>
  )
}

export default Home
