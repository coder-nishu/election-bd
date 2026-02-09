const ResultSummary = ({ constituencies, allVotes }) => {
  // Calculate overall statistics
  const calculateStats = () => {
    let totalVotes = 0;
    const partyVotes = {};
    const constituencyResults = [];

    constituencies.forEach((constituency) => {
      const votes = allVotes[constituency.id] || {};
      const constituencyTotal = Object.values(votes).reduce((a, b) => a + b, 0);
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
      }
    });

    return { totalVotes, partyVotes, constituencyResults };
  };

  const { totalVotes, partyVotes, constituencyResults } = calculateStats();
  const sortedParties = Object.entries(partyVotes).sort((a, b) => b[1].votes - a[1].votes);

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
          <p className="text-emerald-200">১৫টি আসন থেকে</p>
        </div>

        {/* Party-wise Results */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Party Standings */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏛️</span> দলভিত্তিক ফলাফল
            </h3>
            <div className="space-y-4">
              {sortedParties.map(([party, data], index) => {
                const percentage = totalVotes > 0 ? ((data.votes / totalVotes) * 100).toFixed(1) : 0;
                return (
                  <div key={party}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{data.symbol}</span>
                        <span className="font-medium text-gray-700">{party}</span>
                        {index === 0 && totalVotes > 0 && (
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                            শীর্ষে
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-gray-800">{data.votes}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full progress-bar ${
                          index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-amber-500' : 'bg-gray-400'
                        }`}
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
                constituencyResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{result.leader.symbol}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{result.constituency}</p>
                        <p className="text-xs text-gray-500">{result.leader.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{result.votes}</p>
                      <p className="text-xs text-gray-500">
                        {result.total > 0 ? ((result.votes / result.total) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                  </div>
                ))
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
