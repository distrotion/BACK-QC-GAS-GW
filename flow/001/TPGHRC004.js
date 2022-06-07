const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');
var mongodbINS = require('../../function/mongodbINS');
var mssql = require('./../../function/mssql');

const d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;

//----------------- SETUP

let NAME_INS = 'TPG-HRC-004'

//----------------- DATABASE

let MAIN_DATA = 'MAIN_DATA';
let MAIN = 'MAIN';

let PATTERN = 'PATTERN';
let PATTERN_01 = 'PATTERN_01';
let master_FN = 'master_FN';
let ITEMs = 'ITEMs';
let METHOD = 'METHOD';
let MACHINE = 'MACHINE';

//----------------- dynamic

let finddbbuffer = [{}];

let TPGHRC004db = {
  "INS": NAME_INS,
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
  //
  "MeasurmentFOR": "FINAL",
  "inspectionItem": "", //ITEMpice
  "tool": NAME_INS,
  "value":[],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN
  "dateupdatevalue": day,
}


router.post('/TPGHRC004db', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004db--');
  console.log(req.body);
  //-------------------------------------
  let finddb = [{}];
  try {

    finddb = TPGHRC004db;
    finddbbuffer = finddb;
  }
  catch (err) {
    finddb = finddbbuffer;
  }
  //-------------------------------------
  res.json(finddb);
});

router.post('/GETINtoTPGHRC004', async (req, res) => {
  //-------------------------------------
  console.log('--GETINtoTPGHRC004--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  check = TPGHRC004db;
  if (input['PO'] !== undefined && input['CP'] !== undefined && check['PO'] === '') {
    let dbsap = await mssql.qurey(`select * FROM [SAPData_GW_GAS].[dbo].[tblSAPDetail] where [PO] = ${input['PO']}`);
    let findcp = await mongodb.find(PATTERN, PATTERN_01, { "CP": input['CP'] });
    let masterITEMs = await mongodb.find(master_FN, ITEMs, {});
    let MACHINEmaster = await mongodb.find(master_FN, MACHINE, {});

    let ItemPickout = [];
    let ItemPickcodeout = [];
    for (i = 0; i < findcp[0]['FINAL'].length; i++) {
      for (j = 0; j < masterITEMs.length; j++) {
        if (findcp[0]['FINAL'][i]['ITEMs'] === masterITEMs[j]['masterID']) {
          ItemPickout.push(masterITEMs[j]['ITEMs']);
          ItemPickcodeout.push({ "key": masterITEMs[j]['masterID'], "value": masterITEMs[j]['ITEMs'], "METHOD": findcp[0]['FINAL'][i]['METHOD'] });
        }
      }
    }

    let ItemPickoutP2 = []
    let ItemPickcodeoutP2 = [];
    for (i = 0; i < ItemPickcodeout.length; i++) {
      for (j = 0; j < MACHINEmaster.length; j++) {
        if (ItemPickcodeout[i]['METHOD'] === MACHINEmaster[j]['masterID']) {
          if (MACHINEmaster[j]['MACHINE'].includes(NAME_INS)) {
            ItemPickoutP2.push(ItemPickout[i]);
            ItemPickcodeoutP2.push(ItemPickcodeout[i]);
          }
        }
      }
    }

    if (dbsap['recordsets'].length > 0) {

      TPGHRC004db = {
        "INS": NAME_INS,
        "PO": input['PO'] || '',
        "CP": input['CP'] || '',
        "QTY": dbsap['recordsets'][0][0]['QUANTITY'] || '',
        "PROCESS": dbsap['recordsets'][0][0]['PROCESS'] || '',
        "CUSLOT": dbsap['recordsets'][0][0]['CUSLOTNO'] || '',
        "TPKLOT": dbsap['recordsets'][0][0]['FG_CHARG'] || '',
        "FG": dbsap['recordsets'][0][0]['FG'] || '',
        "CUSTOMER": dbsap['recordsets'][0][0]['CUSTOMER'] || '',
        "PART": dbsap['recordsets'][0][0]['PART'] || '',
        "PARTNAME": dbsap['recordsets'][0][0]['PARTNAME'] || '',
        "MATERIAL": dbsap['recordsets'][0][0]['MATERIAL'] || '',
        //----------------------
        "ItemPick": ItemPickoutP2, //---->
        "ItemPickcode": ItemPickcodeoutP2, //---->
        "PCS": "",
        "PCSleft": "",
        "UNIT": "",
        "INTERSEC": "",
        //----------------------
        "preview": [],
        "confirmdata": [],
        "ITEMleftUNIT": [],
        "ITEMleftVALUE": [],
        //
        "MeasurmentFOR": "FINAL",
        "inspectionItem": "", //ITEMpice
        "tool": NAME_INS,
        "value":[],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN
        "dateupdatevalue": day,
      }

      output = 'OK';
    }

  } else {
    output = 'NOK';
  }


  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-geteachITEM', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004-geteachITEM--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [{}];
  if (input['PO'] !== undefined && input['CP'] !== undefined && input['ITEMs'] !== undefined) {
    let findcp = await mongodb.find(PATTERN, PATTERN_01, { "CP": input['CP'] });
    //value
    for (i = 0; i < findcp[0]['FINAL'].length; i++) {
      if (findcp[0]['FINAL'][i]['ITEMs'] === input['ITEMs']['key']) {
        output = [{
          "RESULTFORMAT": findcp[0]['FINAL'][i]['RESULTFORMAT'],
          "GRAPHTYPE": findcp[0]['FINAL'][i]['GRAPHTYPE'],
          "INTERSECTION": findcp[0]['FINAL'][i]['INTERSECTION'],
          "DOCUMENT": findcp[0]['FINAL'][i]['DOCUMENT'],
          "SPECIFICATION": findcp[0]['FINAL'][i]['SPECIFICATION'],
          "POINTPCS": findcp[0]['FINAL'][i]['POINTPCS'],
          "POINT": findcp[0]['FINAL'][i]['POINT'],
          "PCS": findcp[0]['FINAL'][i]['PCS'],
          "FREQUENCY": findcp[0]['FINAL'][i]['FREQUENCY'],
          "MODE": findcp[0]['FINAL'][i]['MODE'],
          "REMARK": findcp[0]['FINAL'][i]['REMARK'],
          "LOAD": findcp[0]['FINAL'][i]['LOAD'],
          "CONVERSE": findcp[0]['FINAL'][i]['CONVERSE'],
        }]
      }
    }
  }

  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-preview', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004-preview--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  if (input.length > 0) {
    if (input[0]['V1'] !== undefined) {
      //-------------------------------------
      try {
        TPGHRC004db['preview'] = input;
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
    TPGHRC004db['preview'] = [];
    output = 'clear';
  }
  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-confirmdata', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004-confirmdata--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {
    TPGHRC004db['confirmdata'] = TPGHRC004db['preview'];
    TPGHRC004db['preview'] = [];

    output = 'OK';
  }
  catch (err) {
    output = 'NOK';
  }
  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-finish', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004-finish--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  //"value":[],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN

  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-feedback', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004-feedback--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
 
  //-------------------------------------
  if(input["PO"] !== undefined && input["ITEMs"] !== undefined){
    let feedback = await mongodb.find(MAIN_DATA, MAIN, { "PO": input['PO'] });
    if(feedback.length>0 && feedback[0]['FINAL'] != undefined && feedback[0]['FINAL'][NAME_INS][input["ITEMs"]] != undefined){
      // console.log(Object.keys(feedback[0]['FINAL'][NAME_INS][input["ITEMs"]]));
      let oblist = Object.keys(feedback[0]['FINAL'][NAME_INS][input["ITEMs"]]);
      let ob = feedback[0]['FINAL'][NAME_INS][input["ITEMs"]];
      for(i=0;i<oblist.length;i++){

      }
      output = 'OK';
    }
    
  }

  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-SETZERO', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004fromINS--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {

    TPGHRC004db = {
      "INS": NAME_INS,
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
      //
      "MeasurmentFOR": "FINAL",
      "inspectionItem": "", //ITEMpice
      "tool": NAME_INS,
      "value":[],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN
      "dateupdatevalue": day,
    }
    output = 'OK';
  }
  catch (err) {
    output = 'NOK';
  }
  //-------------------------------------
  res.json(output);
});



module.exports = router;


