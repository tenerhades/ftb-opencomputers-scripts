const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Fight the Zog" });
});

/**
 * Get memory information, but not the entire object.
 */
router.get('/api/meminfo', (req, res, next) => {
  getMeminfo((meminfoObject) => {
    res.json({
      memUsedPercent: ((meminfoObject.MemTotal - meminfoObject.MemFree) / meminfoObject.MemTotal * 100).toFixed(2),
      memActivePercent: (meminfoObject['Active(anon)'] / meminfoObject.MemTotal * 100).toFixed(2),
      swapUsedPercent: ((meminfoObject.SwapTotal - meminfoObject.SwapFree) / meminfoObject.SwapTotal * 100).toFixed(2)
    });
  });
});

router.get('/api/stat', (req, res, next) => {
  getProcstat();
});

/**
 * Build an object with data from /proc/meminfo
 * 
 * @param {Function} callback called with (meminfoObject)
 */
function getMeminfo(callback) {
  fs.readFile('/proc/meminfo', (err, data) => {
    if (err) {
      throw err;
    }

    let meminfoObject = {};
    data.toString().split('\n').forEach((line) => {
      if (line.length > 0) {
        let key = line.split(':')[0];
        let val = Number(line.split(':')[1].trim().match(/^[0-9]+/)[0]);

        meminfoObject[key] = val;
      }
    });

    callback(meminfoObject);
  });
}

function getProcstat(callback) {
  fs.readFile('/proc/stat', (err, data) => {
    if (err) {
      throw err;
    }

    let result = {};
    data.toString().split('\n').forEach((line) => {
      const elements = line.split(/ +/).filter(Boolean);
      console.log(elements);
    });
  });
}

module.exports = router;
