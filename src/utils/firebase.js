import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../App';

export const saveUserProgress = async (userId, progressData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      progress: progressData,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const loadUserProgress = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().progress;
    }
    return null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

export const saveLeaderboard = async (userId, levelNumber, moves, timeCompleted) => {
  try {
    const leaderboardRef = doc(db, 'leaderboards', `level_${levelNumber}`);
    const leaderboardDoc = await getDoc(leaderboardRef);

    let scores = [];
    if (leaderboardDoc.exists()) {
      scores = leaderboardDoc.data().scores || [];
    }

    scores.push({
      userId,
      moves,
      timeCompleted,
      timestamp: new Date(),
    });

// Keep only top 10 scores
    scores.sort((a, b) => a.moves - b.moves);
    scores = scores.slice(0, 10);

    await setDoc(leaderboardRef, { scores });
  } catch (error) {
    console.error('Error saving leaderboard:', error);
  }
};
