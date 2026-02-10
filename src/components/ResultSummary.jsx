import { useState } from 'react';

const PARTY_COLORS = {
  'BNP': { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'ring-emerald-500' },
  'Jamaat-e-Islami': { bg: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'ring-blue-500' },
  'Jatiya Party': { bg: 'bg-orange-500', bgLight: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'ring-orange-500' },
  'NCP': { bg: 'bg-pink-500', bgLight: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', ring: 'ring-pink-500' },
  'Islami Andolan Bangladesh': { bg: 'bg-teal-500', bgLight: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', ring: 'ring-teal-500' },
  'Bangladesh Khelafat Majlish': { bg: 'bg-purple-500', bgLight: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', ring: 'ring-purple-500' },
  'Biplobi Workers Party': { bg: 'bg-red-500', bgLight: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: 'ring-red-500' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-500', bgLight: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', ring: 'ring-gray-500' };

const ResultSummary = ({ constituencies, allVotes }) => {
  const [selectedParty, setSelectedParty] = useState(null);

  // Calculate overall statistics
  const calculateStats = () => {
    let totalVotes = 0;
    const partyVotes = {};
    const partySeats = {}; // party -> [{ constituency, candidate, votes, total }]
    const constituencyResults = [];

    constituencies.forEach((constituency) => {
      const votes = allVotes[constituency.id] || {};
      const constituencyTotal = Object.entries(votes)
        .filter(([key]) => key !== 'totalVotes')
        .reduce((a, [, b]) => a + b, 0);
      totalVotes += constituencyTotal;

      // Find leading candidate
      let leadingCandidate = null;
      let maxVotes = 0;

      constituency.candidates.forEach((candidate) => {
        const candidateVotes = votes[candidate.id] || 0;

        // Track party votes
        if (!partyVotes[candidate.party]) {
          partyVotes[candidate.party] = { votes: 0, symbol: candidate.symbol };
        }
        partyVotes[candidate.party].votes += candidateVotes;

        if (candidateVotes > maxVotes) {
          maxVotes = candidateVotes;
          leadingCandidate = candidate;
        }
      });

      if (leadingCandidate && maxVotes > 0) {
        constituencyResults.push({
          constituency: constituency.name,
          leader: leadingCandidate,
          votes: maxVotes,
          total: constituencyTotal
        });

        // Track seat wins
        if (!partySeats[leadingCandidate.party]) {
          partySeats[leadingCandidate.party] = { seats: [], symbol: leadingCandidate.symbol };
        }
        partySeats[leadingCandidate.party].seats.push({
          constituency: constituency.name,
          candidate: leadingCandidate.name,
          votes: maxVotes,
          total: constituencyTotal
        });
      }
    });

    return { totalVotes, partyVotes, partySeats, constituencyResults };
  };

  const { totalVotes, partyVotes, partySeats, constituencyResults } = calculateStats();
  const sortedParties = Object.entries(partyVotes).sort((a, b) => b[1].votes - a[1].votes);
  const sortedSeatParties = Object.entries(partySeats).sort((a, b) => b[1].seats.length - a[1].seats.length);
  const totalSeatsWon = Object.values(partySeats).reduce((a, b) => a + b.seats.length, 0);

  const getColor = (party) => PARTY_COLORS[party] || DEFAULT_COLOR;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            লাইভ রেজাল্ট
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            ফলাফলের সারসংক্ষেপ
          </h2>
          <p className="text-gray-600">সকল আসনের সম্মিলিত ডেমো ফলাফল</p>
        </div>

        {/* Total Votes Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-center mb-10 shadow-xl">
          <p className="text-emerald-200 text-lg mb-2">মোট ডেমো ভোট</p>
          <p className="text-5xl md:text-6xl font-bold text-white mb-2">{totalVotes}</p>
          <p className="text-emerald-200">২০টি আসন থেকে</p>
        </div>

        {/* ===== Seat Win Summary Cards ===== */}
        {totalSeatsWon > 0 && (
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center flex items-center justify-center gap-2">
              <span>🏆</span> আসন জয়ের হিসাব
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              যেকোনো দলের কার্ডে ক্লিক করে কোন আসনে জিতেছে দেখুন
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {sortedSeatParties.map(([party, data]) => {
                const color = getColor(party);
                const isSelected = selectedParty === party;
                return (
                  <button
                    key={party}
                    onClick={() => setSelectedParty(isSelected ? null : party)}
                    className={`group relative rounded-xl p-4 text-center transition-all duration-200 cursor-pointer border-2 ${
                      isSelected
                        ? `${color.bgLight} ${color.border} ring-2 ${color.ring} shadow-lg scale-[1.03]`
                        : `bg-white border-gray-200 hover:${color.bgLight} hover:${color.border} hover:shadow-lg hover:scale-[1.03]`
                    }`}
                  >
                    <span className="text-3xl block mb-1">{data.symbol}</span>
                    <p className={`font-bold text-2xl md:text-3xl ${color.text}`}>{data.seats.length}</p>
                    <p className="text-xs text-gray-600 font-medium mt-1 leading-tight">{party}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">আসন জিতেছে</p>
                    
                    {/* Clickable indicator */}
                    <div className={`mt-2 flex items-center justify-center gap-1 text-[11px] font-medium transition-all duration-200 ${
                      isSelected ? `${color.text}` : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {isSelected ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                          <span>বন্ধ করুন</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          <span>বিস্তারিত দেখুন</span>
                        </>
                      )}
                    </div>

                    {isSelected && (
                      <span className={`absolute -top-2 -right-2 ${color.bg} text-white text-[10px] px-2 py-0.5 rounded-full shadow animate-pulse`}>
                        ✓ নির্বাচিত
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Expanded: Show won seats for selected party */}
            {selectedParty && partySeats[selectedParty] && (
              <div className={`rounded-xl border-2 ${getColor(selectedParty).border} ${getColor(selectedParty).bgLight} p-5 mt-2 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-bold text-lg ${getColor(selectedParty).text} flex items-center gap-2`}>
                    <span className="text-2xl">{partySeats[selectedParty].symbol}</span>
                    {selectedParty} — {partySeats[selectedParty].seats.length}টি আসনে এগিয়ে
                  </h4>
                  <button
                    onClick={() => setSelectedParty(null)}
                    className="text-gray-400 hover:text-gray-600 transition p-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {partySeats[selectedParty].seats.map((seat, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{seat.constituency}</p>
                        <p className="text-xs text-gray-500">{seat.candidate}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${getColor(selectedParty).text}`}>{seat.votes} ভোট</p>
                        <p className="text-[11px] text-gray-400">
                          {seat.total > 0 ? ((seat.votes / seat.total) * 100).toFixed(0) : 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Party-wise Results & Constituency Results */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Party Standings */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏛️</span> দলভিত্তিক ভোট
            </h3>
            <div className="space-y-4">
              {sortedParties.map(([party, data], index) => {
                const percentage = totalVotes > 0 ? ((data.votes / totalVotes) * 100).toFixed(1) : 0;
                const color = getColor(party);
                return (
                  <div key={party}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{data.symbol}</span>
                        <span className="font-medium text-gray-700">{party}</span>
                        {index === 0 && totalVotes > 0 && (
                          <span className={`${color.bgLight} ${color.text} text-xs px-2 py-0.5 rounded-full`}>
                            শীর্ষে
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-gray-800">{data.votes}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full progress-bar ${color.bg}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leading Constituencies */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🗳️</span> আসনভিত্তিক অগ্রণী
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {constituencyResults.length > 0 ? (
                constituencyResults.map((result, index) => {
                  const color = getColor(result.leader.party);
                  return (
                    <div
                      key={index}
                      className={`rounded-xl p-3 flex items-center justify-between shadow-sm border ${color.bgLight} ${color.border}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{result.leader.symbol}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{result.constituency}</p>
                          <p className="text-xs text-gray-500">{result.leader.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${color.text}`}>{result.votes}</p>
                        <p className="text-xs text-gray-500">
                          {result.total > 0 ? ((result.votes / result.total) * 100).toFixed(0) : 0}%
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🗳️</span>
                  <p>এখনও কোনো ভোট পড়েনি</p>
                  <p className="text-sm">ভোট দিয়ে ফলাফল দেখুন</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
          <p className="text-amber-800 text-sm flex items-center justify-center gap-2">
            <span>⚠️</span>
            এটি একটি ডেমো ফলাফল। এই তথ্য কোনো অফিসিয়াল নির্বাচনী ফলাফল নয়।
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultSummary;
