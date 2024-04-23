const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Function to calculate the strike rate of a batsman for each season
function strikeRateOfBatsmanEachSeason(inputFilePath, outputFilePath) {
  const batsmanStats = {};

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const matchId = data['match_id'];
      const batsman = data['batsman'];
      const runs = parseInt(data['batsman_runs'], 10);
      const season = matchIdToSeason(matchId);

      if (!batsmanStats[season]) {
        batsmanStats[season] = {};
      }

      if (!batsmanStats[season][batsman]) {
        batsmanStats[season][batsman] = { runs: 0, balls: 0 };
      }

      batsmanStats[season][batsman].runs += runs;
      batsmanStats[season][batsman].balls++;
    })
    .on('end', () => {
      const result = {};

      Object.keys(batsmanStats).forEach((season) => {
        result[season] = {};

        Object.keys(batsmanStats[season]).forEach((batsman) => {
          const stats = batsmanStats[season][batsman];
          const strikeRate = (stats.runs / stats.balls) * 100;

          result[season][batsman] = strikeRate.toFixed(2);
        });
      });

      fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
      console.log('Strike rate of batsmen for each season calculated and saved.');
    });
}

// A function to map match ID to season
function matchIdToSeason(matchId) {
  if (matchId >= 1 && matchId <= 58) {
    return '2017';
  } else if (matchId >= 59 && matchId <= 117) {
    return '2008';
  }else if (matchId >= 118 && matchId <= 174) {
    return '2009';
  }else if (matchId >= 175 && matchId <= 234) {
    return '2010';
  }else if (matchId >= 235 && matchId <= 307) {
    return '2011';
  }else if (matchId >= 308 && matchId <= 381) {
    return '2012';
  }else if (matchId >= 382 && matchId <= 457) {
    return '2013';
  }else if (matchId >= 458 && matchId <= 517) {
    return '2014';
  }else if (matchId >= 518 && matchId <= 576) {
    return '2015';
  }else if (matchId >= 577 && matchId <= 636) {
    return '2016';
  }
  
  return 'Unknown';
}

// Input and output file paths
const inputFilePath = path.join(__dirname, '..', 'data', 'deliveries.csv');
const outputFilePath = path.join(__dirname, '..', 'public', 'output', 'strikeRateOfBatsmanEachSeason.json');

// Call the function
strikeRateOfBatsmanEachSeason(inputFilePath, outputFilePath);
