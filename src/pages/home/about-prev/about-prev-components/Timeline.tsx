import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export interface Achievement {
  year: string;
  heading: string;
  bio: string;
  grade: string;
}

export interface TimelineElements {
  track: HTMLDivElement | null;
  cards: (HTMLDivElement | null)[];
  positions: number[];
}

const ACHIEVEMENTS: Achievement[] = [
  {
    year: '2019',
    heading: 'Started the journey',
    bio: 'Wrote my first line of code and got interested in building things.',
    grade: "",
  },
  {
    year: '2021',
    heading: 'First AI Assistant',
    bio: 'Built an AI Assistant in Python, inspired by JARVIS.',
    grade: "Completed",
  },
  {
    year: '2023',
    heading: 'Class X',
    bio: 'Finished my Secondary Education.',
    grade: "Division: First"
  },
  {
    year: 'Aug 2024',
    heading: 'Smart English Beginners',
    bio: "I passed my Spoken English Beginners course.",
    grade: "Grade: A+"
  },
  {
    year: 'Mar 2025',
    heading: 'Diploma Certificate',
    bio: "I passed my Diploma Course in Digitan Techniques Application",
    grade: "Grade: A"
  },
  {
    year: 'May 2025',
    heading: 'Advance Excel Certificate',
    bio: "I passed my Advance Excel Certification course",
    grade: "Grade: B+"
  },
  {
    year: 'Mar 2026',
    heading: 'Smart English Advance',
    bio: "I passed my Spoken English Advance course",
    grade: "Grade: A"
  },
  {
    year: 'Jun 2026',
    heading: 'Class XII',
    bio: "I passed my Class XII.",
    grade: "Division: First"
  },
  {
    year: 'Jun 2026',
    heading: 'IBM Python for Data Science',
    bio: "I passed my Python for Data Science Course",
    grade: "Completed"
  },
  {
    year: 'Jul 2026',
    heading: 'Software Engineering Job Simulation',
    bio: "Created a project of Dataset Dashboard in Quantinum From Forage.",
    grade: "Completed"
  }
];

const SEGMENT_WIDTH = 260;

const END_PADDING = 160;

interface TimelineProps {
  entries?: Achievement[];
}

const Timeline = forwardRef<TimelineElements, TimelineProps>(
  ({ entries = ACHIEVEMENTS }, ref) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const trackRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const trackWidth = entries.length * SEGMENT_WIDTH + END_PADDING * 2;

    useImperativeHandle(ref, () => ({
      track: trackRef.current,
      cards: cardRefs.current,
      positions: entries.map(
        (_, i) => END_PADDING + i * SEGMENT_WIDTH + SEGMENT_WIDTH / 2
      ),
    }));

    return (
      <div
        ref={trackRef}
        className="relative h-full min-h-[380px] will-change-transform"
        style={{ width: `${trackWidth}px` }}
      >
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-full bg-slate-500" />

        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
          style={{ left: `${END_PADDING - 150}px` }}
        >
          <span className="font-roboto font-semibold tracking-[0.2em] text-slate-400 text-2xl">
            START
          </span>
          <span className="w-2 h-2 rounded-full bg-slate-500" />
        </div>

        {entries.map((entry, i) => {
          const left = END_PADDING + i * SEGMENT_WIDTH + SEGMENT_WIDTH / 2;
          const isAbove = i % 2 === 0;
          const isActive = activeIndex === i;

          return (
            <div
              key={`${entry.year}-${i}`}
              className="absolute top-1/2"
              style={{ left: `${left}px`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className="relative z-10 w-3.5 h-3.5 rounded-full bg-slate-500 ring-4 ring-transparent transition-transform duration-200 hover:scale-125 hover:bg-slate-300 focus:outline-none focus:scale-125"
                aria-label={`${entry.year} — ${entry.heading}`}
              />

              <div
                className="absolute left-1/2 w-px bg-slate-500"
                style={
                  isAbove
                    ? { bottom: '7px', height: '48px' }
                    : { top: '7px', height: '48px' }
                }
              />

              <div
                className={`absolute left-1/2 -translate-x-1/2 w-56 transition-all duration-300 ${
                  isAbove ? 'bottom-[62px]' : 'top-[62px]'
                } ${isActive ? '-translate-y-0.5' : ''}`}
                style={{ perspective: '800px' }}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="bg-slate-950/20 backdrop-blur-md rounded-md px-4 py-3 shadow-lg shadow-black/20 border border-slate-600"
                >
                  <div className="font-mono text-[11px] font-semibold tracking-widest text-slate-400 mb-1">
                    {entry.year}
                  </div>
                  <div className="font-semibold text-slate-300 text-sm leading-snug mb-1">
                    {entry.heading}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {entry.bio}
                  </p>
                  <h1 className="text-slate-400 text-l font-bold font-poppins">{entry.grade}</h1>
                </div>
              </div>
            </div>
          );
        })}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
          style={{ left: `${trackWidth - END_PADDING - 30}px` }}
        >
          <span className="w-2 h-2 rounded-full bg-slate-500/40 border border-dashed border-slate-500" />
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-slate-400">
            TO BE CONTINUED
          </span>
        </div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

export default Timeline;