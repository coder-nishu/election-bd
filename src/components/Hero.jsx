import { useState, useEffect } from 'react';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Election date: February 12, 2026
    const electionDate = new Date('2026-02-12T08:00:00+06:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = electionDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] overflow-hidden">
      {/* Parliament & Crowd Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/jpeg;base64,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')`
        }}
      ></div>
      
      {/* Green Overlay - Custom color #225144 */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(34, 81, 68, 0.85), rgba(34, 81, 68, 0.75), rgba(34, 81, 68, 0.65))' }}></div>

      {/* Top Bar with Countdown */}
      <div className="absolute top-0 left-0 right-0 bg-black/30 backdrop-blur-sm py-2 px-4 z-20">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              লাইভ
            </span>
            <span className="text-white text-xs md:text-sm">ভোট গ্রহণ পর্যন্ত বাকি:</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2 text-white text-xs md:text-sm">
            <span className="bg-gray-800/80 px-2 py-1 rounded font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
            <span>দিন</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>ঘন্টা</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>মিনিট</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span>সেকেন্ড</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8 md:pt-20 md:pb-12 flex flex-col items-center justify-center min-h-[50vh] md:min-h-[55vh] text-center">
        
        {/* Main Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg">
          <span className="text-white">ত্রয়োদশ জাতীয় সংসদ নির্বাচন </span>
          <span className="text-yellow-400">২০২৬</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-100 max-w-2xl mb-6 md:mb-8 px-4">
          আপনার এলাকার প্রার্থীদের জানুন, তুলনা করুন এবং সঠিক সিদ্ধান্ত নিন।
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-2xl">🗳️</span>
            <div className="text-left">
              <p className="text-white font-bold text-lg">২০</p>
              <p className="text-emerald-200 text-xs">আসন</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-2xl">👥</span>
            <div className="text-left">
              <p className="text-white font-bold text-lg">৬০+</p>
              <p className="text-emerald-200 text-xs">প্রার্থী</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-2xl">🇧🇩</span>
            <div className="text-left">
              <p className="text-white font-bold text-lg">৮৩+ লক্ষ</p>
              <p className="text-emerald-200 text-xs">ভোটার</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="#constituencies"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span>🗳️</span>
          <span>ডেমো ভোট দিন</span>
        </a>

        {/* Demo Badge */}
        <p className="mt-4 text-emerald-200 text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          এটি একটি ডেমো প্ল্যাটফর্ম - শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে
        </p>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 52.5C120 45 240 30 360 22.5C480 15 600 15 720 18.75C840 22.5 960 30 1080 33.75C1200 37.5 1320 37.5 1380 37.5L1440 37.5V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#ecfdf5"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
