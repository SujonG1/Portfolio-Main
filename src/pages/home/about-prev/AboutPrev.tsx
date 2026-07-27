import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Timeline, {
  type TimelineElements,
} from "./about-prev-components/Timeline";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const AboutPrev = () => {
  const pinRef = useRef<HTMLDivElement>(null!);
  const leftColRef = useRef<HTMLDivElement>(null!);
  const viewportRef = useRef<HTMLDivElement>(null!);
  const timelineElRef = useRef<TimelineElements>(null!);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null!);
  
  useLayoutEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const els = timelineElRef.current;
    const track = els?.track ?? null;
    if (!pin || !viewport || !track) return;

    const ctx = gsap.context(() => {
      const viewportWidth = viewport.offsetWidth;
      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - viewportWidth);

      const cards = els.cards;
      const positions = els.positions;

      cards.forEach((card, i) => {
        if (!card) return;

        gsap.set(card, { transformOrigin: "top center" });

        const cardPosPx = positions[i];
        const isInitiallyVisible = cardPosPx <= viewportWidth;

        if (isInitiallyVisible) {
          gsap.set(card, {
            rotateX: 0,
            opacity: 1,
          });
        } else {
          gsap.set(card, {
            rotateX: -100,
            opacity: 0,
          });
        }
      });

      const tl = gsap.timeline();

      tl.to(
        track,
        { x: () => -getScrollDistance(), ease: "none", duration: 1 },
        0
      );


      positions.forEach((posPx, i) => {
        const card = cards[i];
        if (!card) return;

        const isInitiallyVisible = posPx <= viewportWidth;
        if (isInitiallyVisible) return; 

        const distance = getScrollDistance();
        
        const p =
          distance > 0
            ? gsap.utils.clamp(
                0,
                1,
                (posPx - viewportWidth * 0.85) / distance
              )
            : 0;

        tl.to(
          card,
          { rotateX: 0, opacity: 1, duration: 0.08, ease: "power2.out" },
          p
        );
      });

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  // ── Text intro animation ──
  useLayoutEffect(() => {
    const col = leftColRef.current;
    if (!col) return;

    const ctx = gsap.context(() => {
      const targets = col.querySelectorAll("h1, p, a");
      gsap.set(targets, { opacity: 0, y: 40 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: col,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, col);

    return () => ctx.revert();
  }, []);

  const handleSkipForward = () => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;
    gsap.to(window, {
      duration: 1.4,
      ease: "power2.inOut",
      scrollTo: { y: trigger.end, autoKill: true },
    });
  };

  const handleSkipBack = () => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;
    gsap.to(window, {
      duration: 1.4,
      ease: "power2.inOut",
      scrollTo: { y: trigger.start, autoKill: true },
    });
  };

  return (
    <div
      ref={pinRef}
      className="w-full h-dvh z-50 flex justify-evenly relative overflow-hidden"
    >
      <div
        ref={leftColRef}
        className="h-full w-1/2 pt-20 flex flex-col gap-30 pl-10"
      >
        <div className="h-1/2 w-full pt-6 pl-12">
          <h1 className="font-grotesk text-7xl text-slate-200 font-bold w-full">
            Who I am
          </h1>
          <p className="text-l font-poppins text-slate-400 text-justify pt-10 w-3/4">
            I'm an aspiring AI/ML Engineer and Full-Stack Developer who loves
            turning ambitious ideas into real, deployed products. My work spans
            AI/ML, RAG, full-stack development, and data science — with a toolkit
            built around Python, React, FastAPI, LangChain, and SQL. Always
            learning, always experimenting, and always up for connecting with
            fellow builders and researchers. Let's create something worth
            talking about.
          </p>
        </div>
        <a
          href="/about"
          className="w-50 border-gray-600 border p-3 rounded-full px-5 bg-slate-950/40 cursor-pointer backdrop-blur-md text-slate-400 hover:bg-slate-300 hover:text-slate-950 transition-color duration-600 ease-in-out font-poppins ml-10 mt-4"
        >
          Learn More
        </a>
      </div>
      <div
        ref={viewportRef}
        className="w-1/2 h-full relative overflow-hidden"
      >
        <Timeline ref={timelineElRef} />
        <div className="absolute bottom-10 right-10 z-20 flex gap-3">
          <button
            onClick={handleSkipBack}
            className="border-gray-600 border p-2 px-4 bg-slate-950/40 cursor-pointer backdrop-blur-md text-slate-400 hover:bg-slate-300 hover:text-slate-950 transition-color duration-600 ease-in-out font-poppins text-sm"
          >
            Back to Start
          </button>
          <button
            onClick={handleSkipForward}
            className="border-gray-600 border p-2 px-4 bg-slate-950/40 cursor-pointer backdrop-blur-md text-slate-400 hover:bg-slate-300 hover:text-slate-950 transition-color duration-600 ease-in-out font-poppins text-sm"
          >
            Skip Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPrev;