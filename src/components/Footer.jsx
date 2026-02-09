const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">নির্বাচন সচেতনতা</h3>
                <p className="text-emerald-300 text-sm">ডেমো প্ল্যাটফর্ম</p>
              </div>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              এটি একটি শিক্ষামূলক ও সচেতনতামূলক প্রকল্প। এই প্ল্যাটফর্ম ব্যবহারকারীদের
              নির্বাচনী প্রক্রিয়া সম্পর্কে ধারণা দেওয়ার জন্য তৈরি করা হয়েছে।
            </p>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> গুরুত্বপূর্ণ বিজ্ঞপ্তি
            </h4>
            <ul className="space-y-2 text-emerald-200 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                এটি কোনো অফিসিয়াল নির্বাচন ব্যবস্থা নয়
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                এখানে প্রদর্শিত ফলাফল বাস্তব নির্বাচনের ফলাফল নয়
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                কোনো ব্যক্তিগত তথ্য সংগ্রহ করা হয় না
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>💻</span> টেকনোলজি
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-emerald-800 px-3 py-1 rounded-full text-sm">React</span>
              <span className="bg-emerald-800 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
              <span className="bg-emerald-800 px-3 py-1 rounded-full text-sm">Vite</span>
              <span className="bg-emerald-800 px-3 py-1 rounded-full text-sm">LocalStorage</span>
            </div>
            <p className="text-emerald-200 text-sm">
              এই প্রকল্পটি আধুনিক ওয়েব টেকনোলজি ব্যবহার করে তৈরি করা হয়েছে।
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-emerald-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-300">
            <p>© ২০২৬ নির্বাচন সচেতনতা প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="flex items-center gap-2">
              <span>🇧🇩</span>
              বাংলাদেশের জন্য তৈরি
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
