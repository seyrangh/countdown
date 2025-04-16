"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Montreal time (EDT) - May 2, 2025 at 10:00 PM
const targetDate = new Date("2025-05-02T22:00:00-04:00");

export default function Home() {
  // Time state management
  const [timeLeft, setTimeLeft] = useState<Record<string, number | null>>({
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  });
  const [isOver, setIsOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Heart animation state
  const [hearts, setHearts] = useState<Array<any>>([]);

  // Track device type for optimizations
  const [isMobile, setIsMobile] = useState(false);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      setIsOver(true);
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / 1000 / 60) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }

  // Generate hearts data
  const generateHearts = () => {
    const heartsData = [];

    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 1.5 + 1;
      const opacity = Math.random() * 0.3 + 0.1;
      const rotation = Math.random() * 30 - 15; // -15 to 15 degrees

      heartsData.push({
        id: i,
        fontSize: `${size}rem`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: opacity,
        rotate: `${rotation}deg`,
        floatDuration: `${20 + Math.random() * 15}s`,
        pulseDuration: `${4 + Math.random() * 3}s`,
        baseOpacity: opacity,
      });
    }

    return heartsData;
  };

  useEffect(() => {
    // Calculate time and mark as loaded on client
    setTimeLeft(calculateTimeLeft());
    setIsLoaded(true);

    // Generate hearts on client-side only
    setHearts(generateHearts());

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Units for display
  const timeUnits = [
    { label: "days", short: "d", value: timeLeft.days },
    { label: "hours", short: "h", value: timeLeft.hours },
    { label: "minutes", short: "m", value: timeLeft.minutes },
    { label: "seconds", short: "s", value: timeLeft.seconds },
  ];

  // Smooth number animation variants
  const numberVariants = {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3 },
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3, ease: "easeInOut" },
      },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <motion.div className="relative w-full max-w-5xl mx-auto px-4 py-8 z-10">
        {isLoaded && (
          <div className="heart-container">
            {hearts.map((heart) => (
              <div
                key={heart.id}
                className="floating-heart"
                style={{
                  fontSize: heart.fontSize,
                  left: heart.left,
                  top: heart.top,
                  opacity: heart.opacity,
                  rotate: heart.rotate,
                }}
              >
                ❤️
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isOver ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-pink-600">
                Counting down to the{" "}
                <span className="text-pink-800">moment</span>
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl my-4 sm:my-8">
                {timeUnits.map((unit, index) => (
                  <motion.div
                    key={unit.label}
                    className="flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border border-pink-100 animate-glow"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-pink-600 tabular-nums relative h-[1.2em] flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        {isLoaded && (
                          <motion.div
                            key={`${unit.label}-${unit.value}`}
                            variants={numberVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            {unit.value ?? "0"}
                          </motion.div>
                        )}
                        {!isLoaded && "-"}
                      </AnimatePresence>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-pink-500 font-medium mt-1 capitalize">
                      {unit.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-gray-700 mt-4 sm:mt-6 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                when I see you,{" "}
                <span className="text-pink-600 font-bold">Alik</span>
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center py-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="w-24 h-24 sm:w-32 sm:h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-lg animate-glow"
              >
                <span className="text-4xl sm:text-5xl">❤️</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-pink-700 mb-4 sm:mb-6">
                We made it
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-lg">
                You're finally here, Alik
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
