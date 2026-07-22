"use client";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  "/weddingpic.jpg",
  "/photography.jpg",
  "/venue.jpeg",
  "/mehendi.jpeg",
  "/decorator.jpg",
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden" aria-hidden="true">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/15" />
    </div>
  );
}
