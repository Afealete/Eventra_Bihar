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
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Wedding Slide"
          className={`object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-1000 ${
            i === index ? "opacity-80" : "opacity-85"
          }`}
          style={{ zIndex: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#8B000F]/80 to-transparent pointer-events-none" />
    </div>
  );
}
