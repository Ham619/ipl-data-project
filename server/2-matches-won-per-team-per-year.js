const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to count matches won per team per year
function countMatchesWonPerTeamPerYear(inputFilePath, outputFilePath) {
  const matchesWonPerTeamPerYear = {};

  // Read CSV data
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const year = data['season'];
      const winner = data['winner'];

      if (winner) {
        if (!matchesWonPerTeamPerYear[year]) {
          matchesWonPerTeamPerYear[year] = {};
        }

        if (!matchesWonPerTeamPerYear[year][winner]) {
          matchesWonPerTeamPerYear[year][winner] = 0;
        }

        matchesWonPerTeamPerYear[year][winner]++;
      }
    })
    .on('end', () => {
      // Write result to JSON
      fs.writeFileSync(outputFilePath, JSON.stringify(matchesWonPerTeamPerYear, null, 2));
      console.log('Matches won per team per year calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'matches.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'matchesWonPerTeamPerYear.json');

// Call the function
countMatchesWonPerTeamPerYear(inputFilePath, outputFilePath);
