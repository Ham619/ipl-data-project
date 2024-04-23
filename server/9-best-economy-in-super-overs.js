const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to find the bowler with the best economy in super overs
function bestEconomyInSuperOvers(inputFilePath, outputFilePath) {
  const superOverStats = {};

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const isSuperOver = data['is_super_over'] === '1';
      const bowler = data['bowler'];
      const totalRuns = parseInt(data['total_runs'], 10);

      if (isSuperOver) {
        if (!superOverStats[bowler]) {
          superOverStats[bowler] = { runs: 0, deliveries: 0 };
        }

        superOverStats[bowler].runs += totalRuns;
        superOverStats[bowler].deliveries += 1;
      }
    })
    .on('end', () => {
      const economyRates = Object.entries(superOverStats).map(([bowler, stats]) => {
        const economy = (stats.runs / stats.deliveries) * 6;
        return { bowler, economy };
      });

      const bestEconomy = economyRates.sort((a, b) => a.economy - b.economy)[0];

      fs.writeFileSync(outputFilePath, JSON.stringify(bestEconomy, null, 2));
      console.log('Best economy in super overs calculated and saved.');
    });
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'deliveries.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'bestEconomyInSuperOvers.json');

// Call the function
bestEconomyInSuperOvers(inputFilePath, outputFilePath);
