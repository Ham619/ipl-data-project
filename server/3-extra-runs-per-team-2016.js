const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to calculate extra runs per team in 2016
function extraRunsConcededIn2016(inputFilePath, outputFilePath) {
  const extraRunsConceded = {};

  // Read CSV data
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const matchId = data['match_id'];
      const extraRuns = parseInt(data['extra_runs'], 10);
      const bowlingTeam = data['bowling_team'];

      if (matchId >= 577 && matchId <= 636) { // 2016 IPL matches
        if (!extraRunsConceded[bowlingTeam]) {
          extraRunsConceded[bowlingTeam] = 0;
        }

        extraRunsConceded[bowlingTeam] += extraRuns;
      }
    })
    .on('end', () => {
      // Write result to JSON
      fs.writeFileSync(outputFilePath, JSON.stringify(extraRunsConceded, null, 2));
      console.log('Extra runs conceded in 2016 calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'deliveries.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'extraRunsPerTeam2016.json');

// Call the function
extraRunsConcededIn2016(inputFilePath, outputFilePath);
