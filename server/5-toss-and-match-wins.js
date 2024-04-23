const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to count times a team won the toss and also the match
function countTossAndMatchWins(inputFilePath, outputFilePath) {
  const tossAndMatchWins = {};

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const tossWinner = data['toss_winner'];
      const matchWinner = data['winner'];

      if (tossWinner === matchWinner) {
        if (!tossAndMatchWins[tossWinner]) {
          tossAndMatchWins[tossWinner] = 0;
        }
        tossAndMatchWins[tossWinner]++;
      }
    })
    .on('end', () => {
      fs.writeFileSync(outputFilePath, JSON.stringify(tossAndMatchWins, null, 2));
      console.log('Toss and match wins calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'matches.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'tossAndMatchWins.json');

// Call the function
countTossAndMatchWins(inputFilePath, outputFilePath);
