
import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ConstituencyCard from './components/ConstituencyCard';
import VoteModal from './components/VoteModal';
import ResultSummary from './components/ResultSummary';
import Footer from './components/Footer';
import useFingerprint from './hooks/useFingerprint';
import { submitVote, subscribeToAllVotes, checkIfVoted } from './services/voteService';

function App() {
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votes, setVotes] = useState({});
  const [votedConstituencies, setVotedConstituencies] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null); // Track which row is expanded
  // Device fingerprinting for vote protection
  const { visitorId, loading: fingerprintLoading } = useFingerprint();

  // Load candidate data from JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/candidateList.json');
        const data = await response.json();
        setConstituencies(data.constituencies || []);
      } catch (error) {
        console.error('Error loading candidate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load votes and voted status from localStorage with fingerprint
  useEffect(() => {
    if (!visitorId) return;
    
    // Check voted status from Firebase
    const checkVotedStatus = async () => {
      if (constituencies.length === 0) return;
      
      const votedList = [];
      for (const c of constituencies) {
        const hasVoted = await checkIfVoted(visitorId, c.id);
        if (hasVoted) {
          votedList.push(c.id);
        }
      }
      setVotedConstituencies(votedList);
    };

    checkVotedStatus();
  }, [visitorId, constituencies]);

  // Subscribe to real-time vote updates from Firebase
  useEffect(() => {
    if (constituencies.length === 0) return;

    const constituencyIds = constituencies.map(c => c.id);
    
    const unsubscribe = subscribeToAllVotes(constituencyIds, (constituencyId, voteData) => {
      setVotes(prev => ({
        ...prev,
        [constituencyId]: voteData
      }));
    });

    return () => unsubscribe();
  }, [constituencies]);

  // Handle opening vote modal
  const handleOpenVoteModal = (constituency) => {
    setSelectedConstituency(constituency);
    setIsModalOpen(true);
  };

  // Handle row toggle - expand/collapse entire row
  const handleRowToggle = (index) => {
    // Calculate which row this card belongs to (3 cards per row)
    const row = Math.floor(index / 3);
    setExpandedRow(expandedRow === row ? null : row);
  };

  // Check if a card's row is expanded
  const isRowExpanded = (index) => {
    const row = Math.floor(index / 3);
    return expandedRow === row;
  };

  // Handle vote submission with Firebase - ONE VOTE ONLY
  const handleVote = async (constituencyId, candidateId) => {
    // Check if fingerprint is available
    if (!visitorId) {
      alert('ডিভাইস যাচাই করা যাচ্ছে না। পেজ রিফ্রেশ করুন।');
      return;
    }

    // Check if already voted ANYWHERE (one vote total per device)
    if (votedConstituencies.length > 0) {
      alert('আপনি ইতিমধ্যে ভোট দিয়েছেন। একটি ডিভাইস থেকে শুধুমাত্র একটি আসনে ভোট দেওয়া যাবে।');
      return;
    }

    try {
      // Submit vote to Firebase
      await submitVote(constituencyId, candidateId, visitorId);
      
      // Update local state
      setVotedConstituencies(prev => [...prev, constituencyId]);
      
      // Close modal
      setIsModalOpen(false);
      setSelectedConstituency(null);
      
      // Success message
      alert('✅ আপনার ভোট সফলভাবে গ্রহণ করা হয়েছে!');
      
      console.log('Vote recorded for device:', visitorId);
    } catch (error) {
      alert(error.message || 'ভোট দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  if (loading || fingerprintLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">
            {fingerprintLoading ? 'ডিভাইস যাচাই করা হচ্ছে...' : 'লোড হচ্ছে...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Hero Banner with Countdown */}
      <Hero />

      {/* How to Vote Guide */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-gray-600">
            <p className="font-semibold text-emerald-700 text-base">কিভাবে ভোট দিবেন?</p>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">১</span>
              <span>আসন নির্বাচন করুন</span>
            </div>
            <span className="hidden md:inline text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">২</span>
              <span>"ভোট দিন" বাটনে ক্লিক করুন</span>
            </div>
            <span className="hidden md:inline text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">৩</span>
              <span>প্রার্থী বেছে নিশ্চিত করুন</span>
            </div>
          </div>
        </div>
      </section>

      {/* Constituency Cards Section */}
      <section id="constituencies" className="py-12 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ঢাকা মহানগরী
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              নির্বাচনী আসনসমূহ
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ঢাকা-১ থেকে ঢাকা-২০ পর্যন্ত সকল আসনের প্রার্থী তালিকা দেখুন এবং ডেমো ভোট দিন
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {constituencies.map((constituency, index) => (
              <ConstituencyCard
                key={constituency.id}
                constituency={constituency}
                onVote={handleOpenVoteModal}
                votes={votes[constituency.id]}
                hasVoted={votedConstituencies.includes(constituency.id)}
                isExpanded={isRowExpanded(index)}
                onToggle={() => handleRowToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Result Summary Section */}
      <ResultSummary 
        constituencies={constituencies}
        allVotes={votes}
      />

      {/* Footer */}
      <Footer />

      {/* Vote Modal */}
      <VoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConstituency(null);
        }}
        constituency={selectedConstituency}
        candidates={selectedConstituency?.candidates}
        onVote={handleVote}
        hasVoted={selectedConstituency ? votedConstituencies.includes(selectedConstituency.id) : false}
      />
    </div>
  );
}

export default App;
