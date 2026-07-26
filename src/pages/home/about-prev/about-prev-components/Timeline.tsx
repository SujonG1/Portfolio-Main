import { useState } from 'react';

export interface Achievement {
  year: string;
  heading: string;
  bio: string;
  grade: string;
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
    grade: "",
  },
  {
    year: '2023',
    heading: 'Class X',
    bio: 'Finished my Secondary Education.',
    grade: "First Division"
  },
  {
    year: '2024',
    heading: 'Diploma in Digital Techniques Application',
    bio: 'Started my Diploma course from Youth Computer Training Centre.',
    grade: "",
  },
  {
    year: 'Aug 2024',
    heading: 'Smart English Beginners',
    bio: "I passed my Spoken English Beginners course.",
    grade: "A+"
  },
  {
    year: 'Mar 2025',
    heading: 'Diploma Certificate',
    bio: "I passed my Diploma Course in Digitan Techniques Application",
    grade: "A"
  },
  {
    year: 'May 2025',
    heading: 'Advance Excel Certificate',
    bio: "I passed my Advance Excel Certification course",
    grade: "B+"
  },
  {
    year: 'Mar 2026',
    heading: 'Smart English Advance',
    bio: "I passed my Spoken English Advance course",
    grade: "A"
  },
  {
    year: 'Jun 2026',
    heading: 'Class XII',
    bio: "I passed my Class XII.",
    grade: "First Division"
  },
  {
    year: 'Jun 2026',
    heading: 'IBM Python for Data Science',
    bio: "I passed my Python for Data Science Course",
    grade: ""
  }
];

// Width (in px) reserved per achievement entry along the line.
const SEGMENT_WIDTH = 260;
// Extra padding on each end for the START / TO BE CONTINUED labels.
const END_PADDING = 160;

interface TimelineProps {
  entries?: Achievement[];
}

const Timeline = ({ entries = ACHIEVEMENTS }: TimelineProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const trackWidth = entries.length * SEGMENT_WIDTH + END_PADDING * 2;

  return (
    <div className="w-full h-full bg-transparent relative overflow-x-auto overflow-y-hidden overflow-x-hidden">
      <div
        className="relative h-full min-h-[380px]"
        style={{ width: `${trackWidth}px` }}
      >
        {/* ── the line itself ── */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-full bg-slate-500" />

        {/* START marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
          style={{ left: `${END_PADDING - 150}px` }}
        >
          <span className="font-roboto font-semibold tracking-[0.2em] text-slate-400 text-2xl">
            START
          </span>
          <span className="w-2 h-2 rounded-full bg-slate-500" />
        </div>

        {/* achievement nodes */}
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
              {/* pin on the line */}
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className="relative z-10 w-3.5 h-3.5 rounded-full bg-slate-500 ring-4 ring-transparent transition-transform duration-200 hover:scale-125 hover:bg-slate-300 focus:outline-none focus:scale-125"
                aria-label={`${entry.year} — ${entry.heading}`}
              />

              {/* stem connecting pin to card */}
              <div
                className="absolute left-1/2 w-px bg-slate-500"
                style={
                  isAbove
                    ? { bottom: '7px', height: '48px' }
                    : { top: '7px', height: '48px' }
                }
              />

              {/* card */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-56 transition-all duration-300 ${
                  isAbove ? 'bottom-[62px]' : 'top-[62px]'
                } ${isActive ? '-translate-y-0.5' : ''}`}
              >
                <div className="bg-slate-950/20 backdrop-blur-md rounded-md px-4 py-3 shadow-lg shadow-black/20 border border-slate-600">
                  <div className="font-mono text-[11px] font-semibold tracking-widest text-slate-400 mb-1">
                    {entry.year}
                  </div>
                  <div className="font-semibold text-slate-300 text-sm leading-snug mb-1">
                    {entry.heading}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {entry.bio}
                  </p>
                  <h1>{entry.grade}</h1>
                </div>
              </div>
            </div>
          );
        })}

        {/* TO BE CONTINUED marker */}
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
    </div>
  );
};

export default Timeline;