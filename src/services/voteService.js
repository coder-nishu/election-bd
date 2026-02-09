// src/services/voteService.js
import { db, doc, setDoc, getDoc, onSnapshot, increment, updateDoc, collection, query, where, getDocs } from './firebase';

// Check if device has voted anywhere (any constituency)
export const checkIfVotedAnywhere = async (visitorId) => {
  try {
    const voteRecordsRef = collection(db, 'voteRecords');
    const q = query(voteRecordsRef, where('visitorId', '==', visitorId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Check vote anywhere error:', error);
    return false;
  }
};

// Submit a vote to Firebase
export const submitVote = async (constituencyId, candidateId, visitorId) => {
  try {
    // 1. Check if this device already voted ANYWHERE (one vote per device)
    const hasVotedAnywhere = await checkIfVotedAnywhere(visitorId);
    if (hasVotedAnywhere) {
      throw new Error('আপনি ইতিমধ্যে ভোট দিয়েছেন। একটি ডিভাইস থেকে শুধুমাত্র একটি আসনে ভোট দেওয়া যাবে।');
    }

    // 2. Update vote count for the candidate
    const voteRef = doc(db, 'votes', constituencyId);
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
      // Update existing votes
      await updateDoc(voteRef, {
        [candidateId]: increment(1),
        totalVotes: increment(1)
      });
    } else {
      // Create new vote document
      await setDoc(voteRef, {
        [candidateId]: 1,
        totalVotes: 1
      });
    }

    // 3. Record that this device voted
    const voteRecordRef = doc(db, 'voteRecords', `${visitorId}_${constituencyId}`);
    await setDoc(voteRecordRef, {
      visitorId: visitorId,
      constituencyId: constituencyId,
      candidateId: candidateId,
      timestamp: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Vote error:', error);
    throw error;
  }
};

// Check if device has voted for a constituency
export const checkIfVoted = async (visitorId, constituencyId) => {
  try {
    const voteRecordRef = doc(db, 'voteRecords', `${visitorId}_${constituencyId}`);
    const voteRecord = await getDoc(voteRecordRef);
    return voteRecord.exists();
  } catch (error) {
    console.error('Check vote error:', error);
    return false;
  }
};

// Get all voted constituencies for a device
export const getVotedConstituencies = async (visitorId, constituencies) => {
  const voted = [];
  for (const c of constituencies) {
    const hasVoted = await checkIfVoted(visitorId, c.id);
    if (hasVoted) {
      voted.push(c.id);
    }
  }
  return voted;
};

// Subscribe to all constituency votes (real-time)
export const subscribeToAllVotes = (constituencyIds, callback) => {
  const unsubscribes = [];
  
  constituencyIds.forEach(id => {
    const voteRef = doc(db, 'votes', id);
    const unsubscribe = onSnapshot(voteRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(id, docSnap.data());
      }
    });
    unsubscribes.push(unsubscribe);
  });

  // Return function to unsubscribe all
  return () => unsubscribes.forEach(unsub => unsub());
};
