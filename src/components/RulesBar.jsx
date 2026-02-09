const RulesBar = () => {
  const rules = [
    { icon: '✅', text: 'বেনামী ভোটিং', textEn: 'Anonymous voting' },
    { icon: '⛔', text: 'প্রতি ডিভাইসে একটি ভোট', textEn: 'One vote per device' },
    { icon: '🔐', text: 'ক্যাপচা যাচাইকরণ', textEn: 'CAPTCHA required' },
    { icon: '⚠️', text: 'শুধুমাত্র ডেমো - অফিসিয়াল নয়', textEn: 'Demo only – not official' }
  ];

  return (
    <section className="bg-emerald-900 py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white text-sm md:text-base"
            >
              <span className="text-xl md:text-2xl">{rule.icon}</span>
              <span className="hidden md:inline">{rule.text}</span>
              <span className="md:hidden text-xs">{rule.icon === '⚠️' ? 'ডেমো' : rule.text.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        
        {/* Warning Banner */}
        <div className="mt-3 text-center">
          <p className="text-emerald-200 text-xs md:text-sm flex items-center justify-center gap-2">
            <span className="text-red-400">⚠️</span>
            এটি একটি শিক্ষামূলক ও সচেতনতামূলক প্রকল্প। এটি কোনো অফিসিয়াল নির্বাচন ব্যবস্থা নয়।
          </p>
        </div>
      </div>
    </section>
  );
};

export default RulesBar;
