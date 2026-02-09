const ConstituencyCard = ({ constituency, onVote, votes, hasVoted, isExpanded, onToggle }) => {
  const totalVotes = votes ? Object.values(votes).reduce((a, b) => a + b, 0) : 0;
  
  const getLeadingCandidate = () => {
    if (!votes || totalVotes === 0) return null;
    const entries = Object.entries(votes);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0];
  };

  const leadingCandidate = getLeadingCandidate();
  const leadingParty = leadingCandidate ? constituency.candidates.find(c => c.id === leadingCandidate[0])?.party : null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300">
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {constituency.name.split('-')[1]}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800">{constituency.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>ঢাকা মহানগরী</span>
              {totalVotes > 0 && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{totalVotes} ভোট</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          {hasVoted && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              ভোট দিয়েছেন
            </span>
          )}
          {leadingParty && totalVotes > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full">
              🏆 {leadingParty}
            </span>
          )}
          
          {/* Expand/Collapse Icon */}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-100 p-4">
          {/* Live Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">প্রার্থী তালিকা</span>
            <span className="live-badge flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

          {/* Candidates List */}
          <div className="space-y-2 mb-4">
            {constituency.candidates.map((candidate) => {
              const candidateVotes = votes?.[candidate.id] || 0;
              const percentage = totalVotes > 0 ? ((candidateVotes / totalVotes) * 100).toFixed(1) : 0;
              const isLeading = leadingCandidate && leadingCandidate[0] === candidate.id;

              return (
                <div
                  key={candidate.id}
                  className={`relative rounded-lg p-3 transition ${
                    isLeading && totalVotes > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{candidate.symbol}</span>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{candidate.name}</p>
                        <p className="text-xs text-gray-500">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700 text-sm">{candidateVotes}</p>
                      <p className="text-xs text-gray-400">{percentage}%</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full progress-bar ${
                        isLeading && totalVotes > 0 ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {isLeading && totalVotes > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      এগিয়ে
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Vote Button */}
          {hasVoted ? (
            <div className="bg-gray-100 text-gray-500 py-2.5 px-4 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              আপনার ভোট গ্রহণ করা হয়েছে
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(constituency);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ভোট দিন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstituencyCard;
