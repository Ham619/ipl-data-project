const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to find top 10 economical bowlers in 2015
function topEconomicalBowlers2015(inputFilePath, outputFilePath) {
  const bowlerStats = {};

  // Read CSV data
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const matchId = data['match_id'];
      const bowler = data['bowler'];
      const totalRuns = parseInt(data['total_runs'], 10);
      const over = parseFloat(data['over']);

      if (matchId >= 435 && matchId <= 503) { // 2015 IPL matches
        if (!bowlerStats[bowler]) {
          bowlerStats[bowler] = { runs: 0, overs: 0 };
        }

        bowlerStats[bowler].runs += totalRuns;
        bowlerStats[bowler].overs += 1 / 6; // Each delivery is 1/6th of an over
      }
    })
    .on('end', () => {
      // Calculate economy rates
      const economyRates = Object.entries(bowlerStats).map(([bowler, stats]) => {
        return { bowler, economy: stats.runs / stats.overs };
      });

      // Sort by economy and get the top 10
      const top10 = economyRates.sort((a, b) => a.economy - b.economy).slice(0, 10);

      // Write result to JSON
      fs.writeFileSync(outputFilePath, JSON.stringify(top10, null, 2));
      console.log('Top 10 economical bowlers in 2015 calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'deliveries.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'top10EconomicalBowlers2015.json');

// Call the function
topEconomicalBowlers2015(inputFilePath, outputFilePath);
