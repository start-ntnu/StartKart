export default class EloCalculator {
    constructor(kFactor = 40) {
      this.k = kFactor;
    }
  
    expectedScore(ratingA, ratingB) {
      return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }
  
    // Adjusts the ratings based on the position of players
    // `ratings` is an array of player ratings in the order they played
    // `positions` is an array of player positions. 1 is for the winner, 2 for second place, etc.
    adjustRatings(ratings, positions) {
      const updatedRatings = [...ratings];
      const n = ratings.length;
  
      for (let i = 0; i < n; i++) {
        let actualScore = 0;
        let expectedScoreTotal = 0;
  
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            const expected = this.expectedScore(ratings[i], ratings[j]);
  
            if (positions[i] < positions[j]) {
              actualScore += 1;
            } else if (positions[i] === positions[j]) {
              actualScore += 0.5;
            }
  
            expectedScoreTotal += expected;
          }
        }
  
        const scoreDiff = actualScore - expectedScoreTotal;
        updatedRatings[i] += this.k * scoreDiff;
      }
  
      return updatedRatings;
    }
  }