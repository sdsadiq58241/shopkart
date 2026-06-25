"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Up to 80% Off",
    subtitle: "Electronics Sale",
    description: "Shop the latest smartphones, laptops, and gadgets at unbeatable prices",
    cta: "Shop Now",
    href: "/products?category=Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
    gradient: "from-blue-900/80 via-blue-800/50 to-transparent",
    accent: "#2874F0",
  },
  {
    id: 2,
    title: "Fashion Week",
    subtitle: "Trending Styles",
    description: "Discover the latest fashion trends from top brands worldwide",
    cta: "Explore Fashion",
    href: "/products?category=Fashion",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
    gradient: "from-purple-900/80 via-purple-800/50 to-transparent",
    accent: "#9C27B0",
  },
  {
    id: 3,
    title: "Home Makeover",
    subtitle: "Great Deals Inside",
    description: "Transform your home with our premium furniture and appliances",
    cta: "Shop Home",
    href: "/products?category=Home+%26+Kitchen",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    gradient: "from-orange-900/80 via-orange-800/50 to-transparent",
    accent: "#FF9F00",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden bg-gray-900 h-64 sm:h-80 md:h-96 lg:h-[28rem]">
      {/* Background Image */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div
            className="max-w-lg"
            key={current}
            style={{ animation: "slideUp 0.4s ease-out" }}
          >
            <span
              className="inline-block text-sm font-bold uppercase tracking-widest px-3 py-1 rounded mb-3 text-white"
              style={{ backgroundColor: slide.accent + "CC" }}
            >
              {slide.subtitle}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
              {slide.title}
            </h1>
            <p className="text-white/80 text-sm sm:text-base mb-6 leading-relaxed">
              {slide.description}
            </p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: slide.accent }}
            >
              {slide.cta} →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`transition-all rounded-full ${
              i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
