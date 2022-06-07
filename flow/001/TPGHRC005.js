const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');
var mssql = require('./../../function/mssql');

let finddbbuffer = [{}];

let PATTERN = 'PATTERN';
let PATTERN_01 = 'PATTERN_01';
let master_FN = 'master_FN';
let ITEMs = 'ITEMs';

let TPGHRC005db = {
  "INS": "TPG-HRC-005",
  "PO": "",
  "CP": "",
  "QTY": "",
  "PROCESS": "",
  "CUSLOT": "",
  "TPKLOT": "",
  "FG": "",
  "CUSTOMER": "",
  "PART": "",
  "PARTNAME": "",
  "MATERIAL": "",
  "ItemPick": [],
  "ItemPickcode": [],
  "PCS": "",
  "PCSleft": "",
  "UNIT": "",
  "INTERSEC": "",
  "preview": [],
  "confirmdata": [],
  "ITEMleftUNIT": [],
  "ITEMleftVALUE": [],
}

router.post('/TPGHRC005db', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC005db--');
  console.log(req.body);
  //-------------------------------------
  let finddb = [{}];
  try {
    finddb = await mongodb.find("INSTRUMENT", "TPG-HRC-005", {});
    finddbbuffer = finddb;
  }
  catch (err) {
    finddb = finddbbuffer;
  }
  //-------------------------------------
  res.json(finddb[0]);
});

router.post('/TPGHRC005-preview', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC005fromINS--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  if (input.length > 0) {
    if (input[0]['V1'] !== undefined) {
      //-------------------------------------
      try {
        let upd = await mongodb.update("INSTRUMENT", "TPG-HRC-005", { "INS": 'TPG-HRC-005' }, { $set: { "preview": input } });
        output = 'OK';
      }
      catch (err) {
        output = 'NOK';
      }
      //-------------------------------------
    } else {
      output = 'NOK';
    }
  } else {
    let upd = await mongodb.update("INSTRUMENT", "TPG-HRC-005", { "INS": 'TPG-HRC-005' }, { $set: { "preview": [] } });
    output = 'clear';
  }
  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC005-confirmdata', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC005fromINS--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {
    let finddb = await mongodb.find("INSTRUMENT", "TPG-HRC-005", {});
    let upd = await mongodb.update("INSTRUMENT", "TPG-HRC-005", { "INS": 'TPG-HRC-005' }, { $set: { "confirmdata": finddb[0]['preview'] } });

    let clear = await mongodb.update("INSTRUMENT", "TPG-HRC-005", { "INS": 'TPG-HRC-005' }, { $set: { "preview": [] } });
    output = 'OK';
  }
  catch (err) {
    output = 'NOK';
  }
  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC005-SETZERO', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC005fromINS--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {

    let upd = await mongodb.update("INSTRUMENT", "TPG-HRC-005", { "INS": 'TPG-HRC-005' }, {
      $set: {
        "INS":"TPG-HRC-005",
        "PO": "",
        "CP": "",
        "QTY": "",
        "PROCESS": "",
        "CUSLOT": "",
        "TPKLOT": "",
        "FG": "",
        "CUSTOMER": "",
        "PART": "",
        "PARTNAME": "",
        "MATERIAL": "",
        "ItemPick": [],
        "ItemPickcode":[],
        "PCS": "",
        "PCSleft": "",
        "UNIT": "",
        "INTERSEC": "",
        "preview": [],
        "confirmdata": [],
        "ITEMleftUNIT": [],
        "ITEMleftVALUE": [],
      }
    });
    output = 'OK';
  }
  catch (err) {
    output = 'NOK';
  }
  //-------------------------------------
  res.json(output);
});





module.exports = router;


let testinit = {
  "INS":"TPG-HRC-005",
  "PO": "",
  "CP": "",
  "QTY": "",
  "PROCESS": "",
  "CUSLOT": "",
  "TPKLOT": "",
  "FG": "",
  "CUSTOMER": "",
  "PART": "",
  "PARTNAME": "",
  "MATERIAL": "",
  "ItemPick": [],
  "ItemPickcode":[],
  "PCS": "",
  "PCSleft": "",
  "UNIT": "",
  "INTERSEC": "",
  "preview": [],
  "confirmdata": [],
  "ITEMleftUNIT": [],
  "ITEMleftVALUE": [],
}