const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');
var mongodbINS = require('../../function/mongodbINS');
var mssql = require('./../../function/mssql');
var request = require('request');

//----------------- date

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
let UNIT = 'UNIT';

//----------------- dynamic

let finddbbuffer = [{}];

let TPGHRC004db = {
  "INS": NAME_INS,
  "PO": "",
  "CP": "",
  "MATCP": '',
  "QTY": "",
  "PROCESS": "",
  "CUSLOT": "",
  "TPKLOT": "",
  "FG": "",
  "CUSTOMER": "",
  "PART": "",
  "PARTNAME": "",
  "MATERIAL": "",
  //---new
  "QUANTITY": '',
  // "PROCESS": '',
  "CUSLOTNO":'',
  "FG_CHARG":'',
  "PARTNAME_PO":'',
  "PART_PO":'',
  "CUSTNAME": '',
  //-------
  "ItemPick": [],
  "ItemPickcode": [],
  "POINTs": "",
  "PCS": "",
  "PCSleft": "",
  "UNIT": "",
  "INTERSEC": "",
  "RESULTFORMAT": "",
  "GRAPHTYPE": "",
  "preview": [],
  "confirmdata": [],
  "ITEMleftUNIT": [],
  "ITEMleftVALUE": [],
  //
  "MeasurmentFOR": "FINAL",
  "inspectionItem": "", //ITEMpice
  "inspectionItemNAME": "",
  "tool": NAME_INS,
  "value": [],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN
  "dateupdatevalue": day,
}

router.get('/CHECK-TPGHRC004', async (req, res) => {

  res.json(TPGHRC004db['PO']);
});


router.post('/TPGHRC004db', async (req, res) => {
  //-------------------------------------
  // console.log('--TPGHRC004db--');
  // console.log(req.body);
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
        "MATCP": input['CP'] || '',
        "QTY": dbsap['recordsets'][0][0]['QUANTITY'] || '',
        "PROCESS": dbsap['recordsets'][0][0]['PROCESS'] || '',
        "CUSLOT": dbsap['recordsets'][0][0]['CUSLOTNO'] || '',
        "TPKLOT": dbsap['recordsets'][0][0]['FG_CHARG'] || '',
        "FG": dbsap['recordsets'][0][0]['FG'] || '',
        "CUSTOMER": dbsap['recordsets'][0][0]['CUSTOMER'] || '',
        "PART": dbsap['recordsets'][0][0]['PART'] || '',
        "PARTNAME": dbsap['recordsets'][0][0]['PARTNAME'] || '',
        "MATERIAL": dbsap['recordsets'][0][0]['MATERIAL'] || '',
        //---new
        "QUANTITY":dbsap['recordsets'][0][0]['QUANTITY'] || '',
        // "PROCESS":dbsap['recordsets'][0][0]['PROCESS'] || '',
        "CUSLOTNO":dbsap['recordsets'][0][0]['CUSLOTNO'] || '',
        "FG_CHARG":dbsap['recordsets'][0][0]['FG_CHARG'] || '',
        "PARTNAME_PO":dbsap['recordsets'][0][0]['PARTNAME_PO'] || '',
        "PART_PO":dbsap['recordsets'][0][0]['PART_PO'] || '',
        "CUSTNAME":dbsap['recordsets'][0][0]['CUSTNAME'] || '',
        //----------------------
        "ItemPick": ItemPickoutP2, //---->
        "ItemPickcode": ItemPickcodeoutP2, //---->
        "POINTs": "",
        "PCS": "",
        "PCSleft": "",
        "UNIT": "",
        "INTERSEC": "",
        "RESULTFORMAT": "",
        "GRAPHTYPE": "",
        //----------------------
        "preview": [],
        "confirmdata": [],
        "ITEMleftUNIT": [],
        "ITEMleftVALUE": [],
        //
        "MeasurmentFOR": "FINAL",
        "inspectionItem": "", //ITEMpice
        "inspectionItemNAME": "",
        "tool": NAME_INS,
        "value": [],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN
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
  let inputB = req.body;

  let ITEMSS = '';
  let output = 'NOK';

  for (i = 0; i < TPGHRC004db['ItemPickcode'].length; i++) {
    if (TPGHRC004db['ItemPickcode'][i]['value'] === inputB['ITEMs']) {
      ITEMSS = TPGHRC004db['ItemPickcode'][i]['key'];
    }
  }


  if (ITEMSS !== '') {

    //-------------------------------------
    TPGHRC004db['inspectionItem'] = ITEMSS;
    TPGHRC004db['inspectionItemNAME'] = inputB['ITEMs'];
    let input = { 'PO': TPGHRC004db["PO"], 'CP': TPGHRC004db["CP"], 'ITEMs': TPGHRC004db['inspectionItem'] };
    //-------------------------------------
    if (input['PO'] !== undefined && input['CP'] !== undefined && input['ITEMs'] !== undefined) {
      let findcp = await mongodb.find(PATTERN, PATTERN_01, { "CP": input['CP'] });
      let UNITdata = await mongodb.find(master_FN, UNIT, {});
      let masterITEMs = await mongodb.find(master_FN, ITEMs, { "masterID": TPGHRC004db['inspectionItem'] });

      for (i = 0; i < findcp[0]['FINAL'].length; i++) {
        if (findcp[0]['FINAL'][i]['ITEMs'] === input['ITEMs']) {

          // output = [{
          //   "RESULTFORMAT": findcp[0]['FINAL'][i]['RESULTFORMAT'],
          //   "GRAPHTYPE": findcp[0]['FINAL'][i]['GRAPHTYPE'],
          //   "INTERSECTION": findcp[0]['FINAL'][i]['INTERSECTION'],
          //   "DOCUMENT": findcp[0]['FINAL'][i]['DOCUMENT'],
          //   "SPECIFICATION": findcp[0]['FINAL'][i]['SPECIFICATION'],
          //   "POINTPCS": findcp[0]['FINAL'][i]['POINTPCS'],
          //   "POINT": findcp[0]['FINAL'][i]['POINT'],
          //   "PCS": findcp[0]['FINAL'][i]['PCS'],
          //   "FREQUENCY": findcp[0]['FINAL'][i]['FREQUENCY'],
          //   "MODE": findcp[0]['FINAL'][i]['MODE'],
          //   "REMARK": findcp[0]['FINAL'][i]['REMARK'],
          //   "LOAD": findcp[0]['FINAL'][i]['LOAD'],
          //   "CONVERSE": findcp[0]['FINAL'][i]['CONVERSE'],
          // }]

          if (masterITEMs.length > 0) {
            //
            TPGHRC004db["RESULTFORMAT"] = masterITEMs[0]['RESULTFORMAT']
            TPGHRC004db["GRAPHTYPE"] = masterITEMs[0]['GRAPHTYPE']
          }

          for (j = 0; j < UNITdata.length; j++) {
            if (findcp[0]['FINAL'][i]['UNIT'] == UNITdata[j]['masterID']) {
              TPGHRC004db["UNIT"] = UNITdata[j]['UNIT'];
            }
          }

          TPGHRC004db["POINTs"] = findcp[0]['FINAL'][i]['POINT'];
          TPGHRC004db["PCS"] = findcp[0]['FINAL'][i]['PCS'];
          TPGHRC004db["PCSleft"] = findcp[0]['FINAL'][i]['PCS'];

          TPGHRC004db["INTERSEC"] = "";
          output = 'OK';
          let findpo = await mongodb.find(MAIN_DATA, MAIN, { "PO": input['PO'] });
          if (findpo.length > 0) {
            request.post(
              'http://127.0.0.1:16000/TPGHRC004-feedback',
              { json: { "PO": TPGHRC004db['PO'], "ITEMs": TPGHRC004db['inspectionItem'] } },
              function (error, response, body2) {
                if (!error && response.statusCode == 200) {
                  // console.log(body2);
                  if (body2 === 'OK') {
                    // output = 'OK';
                  }
                }
              }
            );
          }
          break;
        }
      }
    }

  } else {
    TPGHRC004db["POINTs"] = '',
      TPGHRC004db["PCS"] = '',
      TPGHRC004db["PCSleft"] = '',
      TPGHRC004db["UNIT"] = "",
      TPGHRC004db["INTERSEC"] = "",
      output = 'NOK';
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
  // let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {
    let datapush = TPGHRC004db['preview'][0]

    if (TPGHRC004db['RESULTFORMAT'] === 'Graph') {

    } else if (TPGHRC004db['RESULTFORMAT'] === 'Number') {

      let pushdata = TPGHRC004db['preview'][0]

      pushdata['V5'] = TPGHRC004db['confirmdata'].length + 1
      pushdata['V1'] = `${TPGHRC004db['confirmdata'].length + 1}:${pushdata['V1']}`

      TPGHRC004db['confirmdata'].push(pushdata);
      TPGHRC004db['preview'] = [];
      output = 'OK';
    }
  }
  catch (err) {
    output = 'NOK';
  }
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
  if (input["PO"] !== undefined && input["ITEMs"] !== undefined) {
    let feedback = await mongodb.find(MAIN_DATA, MAIN, { "PO": input['PO'] });
    if (feedback.length > 0 && feedback[0]['FINAL'] != undefined && feedback[0]['FINAL'][NAME_INS] != undefined && feedback[0]['FINAL'][NAME_INS][input["ITEMs"]] != undefined) {
      // console.log(Object.keys(feedback[0]['FINAL'][NAME_INS][input["ITEMs"]]));
      let oblist = Object.keys(feedback[0]['FINAL'][NAME_INS][input["ITEMs"]]);
      let ob = feedback[0]['FINAL'][NAME_INS][input["ITEMs"]];



      let LISTbuffer = [];
      let ITEMleftVALUEout = [];
      for (i = 0; i < oblist.length; i++) {
        LISTbuffer.push(...ob[oblist[i]])
      }
      TPGHRC004db["PCSleft"] = `${parseInt(TPGHRC004db["PCS"]) - oblist.length}`;
      if (TPGHRC004db['RESULTFORMAT'] === 'Number' || TPGHRC004db['RESULTFORMAT'] === 'Text') {
        for (i = 0; i < LISTbuffer.length; i++) {
          if (LISTbuffer[i]['PO1'] === 'Mean') {
            ITEMleftVALUEout.push({ "V1": 'Mean', "V2": `${LISTbuffer[i]['PO3']}` })
          } else {
            ITEMleftVALUEout.push({ "V1": `${LISTbuffer[i]['PO2']}`, "V2": `${LISTbuffer[i]['PO3']}` })
          }

        }
        // console.log(LISTbuffer);
        
        TPGHRC004db["ITEMleftUNIT"] = [{ "V1": "FINAL", "V2": `${oblist.length}` }];
        TPGHRC004db["ITEMleftVALUE"] = ITEMleftVALUEout;

      }
      // output = 'OK';
      if ((parseInt(TPGHRC004db["PCS"]) - oblist.length) == 0) {
        //CHECKlist
        for (i = 0; i < feedback[0]['CHECKlist'].length; i++) {
          if (input["ITEMs"] === feedback[0]['CHECKlist'][i]['key']) {
            feedback[0]['CHECKlist'][i]['FINISH'] = 'OK';
            // console.log(feedback[0]['CHECKlist']);
            let feedbackupdate = await mongodb.update(MAIN_DATA, MAIN, { "PO": input['PO'] }, { "$set": { 'CHECKlist': feedback[0]['CHECKlist'] } });
            break;
          }
        }
        //input["ITEMs"] 
        let masterITEMs = await mongodb.find(master_FN, ITEMs, { "masterID": input["ITEMs"] });


        if (feedback[0]['FINAL_ANS'] === undefined) {
          feedback[0]['FINAL_ANS'] = {}
        }
        if (masterITEMs.length > 0) {
          let anslist = [];
          let anslist_con = [];


          if (masterITEMs[0]['RESULTFORMAT'] === 'Number') {
            for (i = 0; i < LISTbuffer.length; i++) {
              if (LISTbuffer[i]['PO1'] === 'Mean') {
                anslist.push(LISTbuffer[i]['PO3'])
                anslist_con.push(LISTbuffer[i]['PO5'])
              }
            }

            let sum1 = anslist.reduce((a, b) => a + b, 0);
            let avg1 = (sum1 / anslist.length) || 0;
            let sum2 = anslist_con.reduce((a, b) => a + b, 0);
            let avg2 = (sum2 / anslist_con.length) || 0;

            feedback[0]['FINAL_ANS'][input["ITEMs"]] = avg1;
            feedback[0]['FINAL_ANS'][`${input["ITEMs"]}_c`] = avg2;

            let feedbackupdateRESULTFORMAT = await mongodb.update(MAIN_DATA, MAIN, { "PO": input['PO'] }, { "$set": { 'FINAL_ANS': feedback[0]['FINAL_ANS'] } });


          } else if (masterITEMs[0]['RESULTFORMAT'] === 'Text') {

          } else if (masterITEMs[0]['RESULTFORMAT'] === 'Graph') {

          } else if (masterITEMs[0]['RESULTFORMAT'] === 'Picture') {

          } else if (masterITEMs[0]['RESULTFORMAT'] === 'OCR') {

          } else {

          }
        }
        let CHECKlistdataFINISH = [];

        for (i = 0; i < feedback[0]['CHECKlist'].length; i++) {
          if (feedback[0]['CHECKlist'][i]['FINISH'] !== undefined) {
            if(feedback[0]['CHECKlist'][i]['FINISH'] === 'OK'){
              CHECKlistdataFINISH.push(feedback[0]['CHECKlist'][i]['key'])
            }else{
            }
          }
        }

        if(CHECKlistdataFINISH.length === feedback[0]['CHECKlist'].length){
          // feedback[0]['FINAL_ANS']["ALL_DONE"] = "DONE";
          // feedback[0]['FINAL_ANS']["PO_judgment"] ="pass";
          let feedbackupdateFINISH = await mongodb.update(MAIN_DATA, MAIN, { "PO": input['PO'] }, { "$set": { "ALL_DONE": "DONE" , "PO_judgment": "pass" ,} });
        }

      }
    } else {
      TPGHRC004db["ITEMleftUNIT"] = '';
      TPGHRC004db["ITEMleftVALUE"] = '';
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
      "MATCP":  '',
      "QTY": "",
      "PROCESS": "",
      "CUSLOT": "",
      "TPKLOT": "",
      "FG": "",
      "CUSTOMER": "",
      "POINTs": "",
      "PART": "",
      "PARTNAME": "",
      "MATERIAL": "",
      //---new
      "QUANTITY": '',
      // "PROCESS": '',
      "CUSLOTNO":'',
      "FG_CHARG":'',
      "PARTNAME_PO":'',
      "PART_PO":'',
      "CUSTNAME": '',
      //-----
      "ItemPick": [],
      "ItemPickcode": [],
      "PCS": "",
      "PCSleft": "",
      "UNIT": "",
      "INTERSEC": "",
      "RESULTFORMAT": "",
      "GRAPHTYPE": "",
      "preview": [],
      "confirmdata": [],
      "ITEMleftUNIT": [],
      "ITEMleftVALUE": [],
      //
      "MeasurmentFOR": "FINAL",
      "inspectionItem": "", //ITEMpice
      "inspectionItemNAME": "",
      "tool": NAME_INS,
      "value": [],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN
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

router.post('/TPGHRC004-CLEAR', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004fromINS--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {

    TPGHRC004db['preview'] = [];
    TPGHRC004db['confirmdata'] = [];

    output = 'OK';
  }
  catch (err) {
    output = 'NOK';
  }
  //-------------------------------------
  res.json(output);
});

router.post('/TPGHRC004-RESETVALUE', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004fromINS--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';
  //-------------------------------------
  try {

    let all = TPGHRC004db['confirmdata'].length
    if (all > 0) {
      TPGHRC004db['confirmdata'].pop();
    }

    output = 'OK';
  }
  catch (err) {
    output = 'NOK';
  }
  //-------------------------------------
  res.json(output);
});

//"value":[],  //key: PO1: itemname ,PO2:V01,PO3: V02,PO4: V03,PO5:V04,P06:INS,P9:NO.,P10:TYPE, last alway mean P01:"MEAN",PO2:V01,PO3:V02-MEAN,PO4: V03,PO5:V04-MEAN


router.post('/TPGHRC004-FINISH', async (req, res) => {
  //-------------------------------------
  console.log('--TPGHRC004-FINISH--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'OK';
  if (TPGHRC004db['RESULTFORMAT'] === 'Number' || TPGHRC004db['RESULTFORMAT'] === 'Text') {

    TPGHRC004db["value"] = [];
    for (i = 0; i < TPGHRC004db['confirmdata'].length; i++) {
      TPGHRC004db["value"].push({
        "PO1": TPGHRC004db["inspectionItemNAME"],
        "PO2": TPGHRC004db['confirmdata'][i]['V1'],
        "PO3": TPGHRC004db['confirmdata'][i]['V2'],
        "PO4": TPGHRC004db['confirmdata'][i]['V3'],
        "PO5": TPGHRC004db['confirmdata'][i]['V4'],
        "PO6": "-",
        "PO7": "-",
        "PO8": "-",
        "PO9": i + 1,
        "PO10": "AUTO",
      });
    }
    if (TPGHRC004db["value"].length > 0) {
      let mean01 = [];
      let mean02 = [];
      for (i = 0; i < TPGHRC004db["value"].length; i++) {
        mean01.push(parseFloat(TPGHRC004db["value"][i]["PO3"]));
        mean02.push(parseFloat(TPGHRC004db["value"][i]["PO5"]));
      }
      let sum1 = mean01.reduce((a, b) => a + b, 0);
      let avg1 = (sum1 / mean01.length) || 0;
      let sum2 = mean02.reduce((a, b) => a + b, 0);
      let avg2 = (sum2 / mean02.length) || 0;
      TPGHRC004db["value"].push({
        "PO1": 'Mean',
        "PO2": TPGHRC004db['confirmdata'][0]['V1'],
        "PO3": avg1,
        "PO4": TPGHRC004db['confirmdata'][0]['V3'],
        "PO5": avg2,
      });
    }

  } else if (TPGHRC004db['RESULTFORMAT'] === 'OCR' || TPGHRC004db['RESULTFORMAT'] === 'Picture') {

  } else if (TPGHRC004db['RESULTFORMAT'] === 'Graph') {

  }

  if (TPGHRC004db['RESULTFORMAT'] === 'Number' ||
    TPGHRC004db['RESULTFORMAT'] === 'Text' ||
    TPGHRC004db['RESULTFORMAT'] === 'OCR' ||
    TPGHRC004db['RESULTFORMAT'] === 'Picture') {
    request.post(
      'http://127.0.0.1:16000/FINISHtoDB',
      { json: TPGHRC004db },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body);
          // if (body === 'OK') {
          TPGHRC004db['confirmdata'] = [];
          TPGHRC004db["value"] = [];
          //------------------------------------------------------------------------------------

          request.post(
            'http://127.0.0.1:16000/TPGHRC004-feedback',
            { json: { "PO": TPGHRC004db['PO'], "ITEMs": TPGHRC004db['inspectionItem'] } },
            function (error, response, body2) {
              if (!error && response.statusCode == 200) {
                // console.log(body2);
                // if (body2 === 'OK') {
                output = 'OK';
                // }
              }
            }
          );

          //------------------------------------------------------------------------------------
          // }

        }
      }
    );
  }

  //-------------------------------------
  res.json(TPGHRC004db);
});


module.exports = router;


