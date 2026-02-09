import { useState, useEffect } from 'react';

const VoteModal = ({ isOpen, onClose, constituency, candidates, onVote }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [step, setStep] = useState(1); // 1: select candidate, 2: captcha, 3: confirm
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset modal state when constituency changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCandidate(null);
      setCaptchaInput('');
      setCaptchaAnswer(null);
      setCaptchaQuestion('');
      setStep(1);
      setIsSubmitting(false);
    }
  }, [isOpen, constituency?.id]);

  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
    setCaptchaInput('');
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedCandidate) {
      generateCaptcha();
      setStep(2);
    } else if (step === 2) {
      if (parseInt(captchaInput) === captchaAnswer) {
        setStep(3);
      } else {
        alert('ক্যাপচা ভুল হয়েছে। আবার চেষ্টা করুন।');
        generateCaptcha();
      }
    }
  };

  const handleSubmitVote = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    try {
      await onVote(constituency.id, selectedCandidate.id);
      onClose();
    } catch (error) {
      alert('ভোট দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedCandidate(null);
    setCaptchaInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 md:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">{constituency?.name}</h3>
              <p className="text-emerald-200 text-sm">ডেমো ভোট দিন</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-emerald-300'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-1 ${step > s ? 'bg-white' : 'bg-emerald-600'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[50vh]">
          {/* Step 1: Select Candidate */}
          {step === 1 && (
            <div>
              <p className="text-gray-600 mb-4">প্রার্থী নির্বাচন করুন:</p>
              <div className="space-y-3">
                {candidates?.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => handleSelectCandidate(candidate)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      selectedCandidate?.id === candidate.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl">{candidate.symbol}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.party}</div>
                    </div>
                    {selectedCandidate?.id === candidate.id && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: CAPTCHA */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔐</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">নিরাপত্তা যাচাইকরণ</h4>
              <p className="text-gray-600 mb-6">নিচের গণিত সমস্যার সমাধান করুন:</p>
              
              <div className="bg-gray-100 rounded-xl p-6 mb-4">
                <p className="text-3xl font-bold text-emerald-700">{captchaQuestion}</p>
              </div>
              
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="উত্তর লিখুন"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">ভোট নিশ্চিত করুন</h4>
              
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
                <p className="text-gray-600 mb-2">আপনি ভোট দিচ্ছেন:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{selectedCandidate?.symbol}</span>
                  <div>
                    <p className="font-bold text-lg text-emerald-800">{selectedCandidate?.name}</p>
                    <p className="text-emerald-600">{selectedCandidate?.party}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                এই ভোট পরিবর্তন করা যাবে না। আপনি কি নিশ্চিত?
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 bg-gray-50 border-t flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              পিছনে
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={step === 1 && !selectedCandidate}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                (step === 1 && !selectedCandidate)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              পরবর্তী
            </button>
          ) : (
            <button
              onClick={handleSubmitVote}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'ভোট দেওয়া হচ্ছে...' : 'ভোট নিশ্চিত করুন'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteModal;
