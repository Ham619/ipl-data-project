const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to count matches per year
function countMatchesPerYear(inputFilePath, outputFilePath) {
  const matchesPerYear = {};

  // Read CSV data
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const year = data['season']; // Assuming the column name for the year
      if (!matchesPerYear[year]) {
        matchesPerYear[year] = 0;
      }
      matchesPerYear[year]++;
    })
    .on('end', () => {
      // Write result to JSON
      fs.writeFileSync(outputFilePath, JSON.stringify(matchesPerYear, null, 2));
      console.log('Matches per year calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'matches.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'matchPerYear.json');

// Call the function
countMatchesPerYear(inputFilePath, outputFilePath);
