const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to find the player with the most "Player of the Match" awards each season
function mostPlayerOfTheMatchEachSeason(inputFilePath, outputFilePath) {
  const awardsPerSeason = {};

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const season = data['season'];
      const playerOfTheMatch = data['player_of_match'];

      if (!awardsPerSeason[season]) {
        awardsPerSeason[season] = {};
      }

      if (!awardsPerSeason[season][playerOfTheMatch]) {
        awardsPerSeason[season][playerOfTheMatch] = 0;
      }

      awardsPerSeason[season][playerOfTheMatch]++;
    })
    .on('end', () => {
      const result = {};

      Object.keys(awardsPerSeason).forEach((season) => {
        const players = Object.entries(awardsPerSeason[season]);
        const topPlayer = players.sort((a, b) => b[1] - a[1])[0];
        result[season] = { player: topPlayer[0], awards: topPlayer[1] };
      });

      fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
      console.log('Most "Player of the Match" each season calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'matches.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'mostPlayerOfTheMatchEachSeason.json');

// Call the function
mostPlayerOfTheMatchEachSeason(inputFilePath, outputFilePath);
