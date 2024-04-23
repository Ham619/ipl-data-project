const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to find the highest number of times one player has been dismissed by another player
function highestDismissals(inputFilePath, outputFilePath) {
  const dismissals = {};

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const dismissedPlayer = data['player_dismissed'];
      const bowler = data['bowler'];

      if (dismissedPlayer) {
        const key = `${bowler}-${dismissedPlayer}`;

        if (!dismissals[key]) {
          dismissals[key] = 0;
        }

        dismissals[key]++;
      }
    })
    .on('end', () => {
      const highestDismissal = Object.entries(dismissals).sort((a, b) => b[1] - a[1])[0];

      const result = {
        bowler: highestDismissal[0].split('-')[0],
        player: highestDismissal[0].split('-')[1],
        dismissals: highestDismissal[1]
      };

      fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
      console.log('Highest dismissals calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'deliveries.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'highestDismissals.json');

// Call the function
highestDismissals(inputFilePath, outputFilePath);
