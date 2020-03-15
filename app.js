'use strict';
// モジュール呼び出し
const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = columns[3];
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        pop10:0,
        pop15:0,
        change:null
      };
    }
    if (year === 2010) {
      value.pop10 = popu;
    }
    if (year === 2015) {
      value.pop15 = popu;
    }
    // console.log(year);
    // console.log(prefecture);
    // console.log(popu);
    prefectureDataMap.set(prefecture, value);
  }
});

rl.on('close', function(){
  // for (let[key, value] of prefectureDataMap) {
  //   value.change = value.pop15 / value.pop10;
  // }
  prefectureDataMap.forEach((value)=>{
    value.change = value.pop15 / value.pop10;
  })

  const rankingArray = Array.from(prefectureDataMap).sort(function(pair1, pair2){
    return pair2[1].change - pair1[1].change;
  });

  const rankingStrings = rankingArray.map(([key, value])=>{
    return key + ': ' + value.pop10 + '=>' + value.pop15 + ' 変化率: ' +  value.change;
  });

  console.log(rankingStrings);
  //console.log(prefectureDataMap);
  //console.log(rankingArray);
});
