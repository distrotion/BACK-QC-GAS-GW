const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');
var mssql = require('./../../function/mssql');

//----------------- date

const d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;

//----------------- DATABASE

let MAIN_DATA = 'MAIN_DATA';
let MAIN = 'MAIN';

let PATTERN = 'PATTERN';
let PATTERN_01 = 'PATTERN_01';
let master_FN = 'master_FN';
let ITEMs = 'ITEMs';
let METHOD = 'METHOD';
let MACHINE = 'MACHINE';



router.post('/FINISHtoDB', async (req, res) => {
  //-------------------------------------
  console.log('--FINISHtoDB--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = input;
  //-------------------------------------
  let outputs = '';
  let findpo = await mongodb.find(MAIN_DATA, MAIN, { "PO": input['PO'] });
  if (findpo.length === 0) {
    let nameFOR = input['MeasurmentFOR'];
    let nameTool = input['tool'];
    let nameItem = input['inspectionItem'];
    let value = input['value'];
    let Item = {};
    let Tool = {};

    Item[nameItem] = { "PSC1": value };
    Tool[nameTool] = Item;

    output[nameFOR] = Tool;
    output['dateG'] = new Date();
    output['dateGSTR'] =day;

    delete output['MeasurmentFOR'];
    delete output['tool'];
    delete output['inspectionItem'];
    delete output['value'];
    delete output['pieces'];
    //----new
    delete output['INS'];
    delete output['inspectionItemNAME'];
    delete output['ItemPick'];
    delete output['ItemPickcode'];
    delete output['POINTs'];
    delete output['PCS'];
    delete output['PCSleft'];
    delete output['UNIT'];
    delete output['INTERSEC'];
    delete output['preview'];
    delete output['confirmdata'];
    delete output['ITEMleftUNIT'];
    delete output['ITEMleftVALUE'];


    let findcp = await mongodb.find(PATTERN, PATTERN_01, { "CP": input['CP'] });
    let masterITEMs = await mongodb.find(master_FN, ITEMs, {});
    let MACHINEmaster = await mongodb.find(master_FN, MACHINE, {});

    let ItemPickcodeout = [];
    for (i = 0; i < findcp[0]['FINAL'].length; i++) {
      for (j = 0; j < masterITEMs.length; j++) {
        if (findcp[0]['FINAL'][i]['ITEMs'] === masterITEMs[j]['masterID']) {
          ItemPickcodeout.push({ "key": masterITEMs[j]['masterID'], "value": masterITEMs[j]['ITEMs'], "METHOD": findcp[0]['FINAL'][i]['METHOD'] });
        }
      }
    }

    output['CHECKlist'] = ItemPickcodeout;

    let insertdb = await mongodb.insertMany(MAIN_DATA, MAIN, [output]);

    outputs = 'OK';
  } else {

    console.log("---->");
    let input_S2_1 = findpo[0]; //input1
    let input_S2_2 = output;     //input2
    let objectR = Object.getOwnPropertyNames(input_S2_1)
    let findMF = false;

    for (i = 0; i < objectR.length; i++) {
      if (objectR[i] === input_S2_2['MeasurmentFOR']) {
        findMF = true;
      }
    }
    if (findMF === false) {
      let nameFOR = input_S2_2['MeasurmentFOR'];
      let nameTool = input_S2_2['tool'];
      let nameItem = input_S2_2['inspectionItem'];
      let value = input_S2_2['value'];
      let Item = {};
      let Tool = {};
      let FOR = {};
      Tool[nameTool] = Item;
      FOR[nameFOR] = Tool;
      let out_S2_1 = { "PO": input_S2_2.PO };
      let out_S2_2 = { $set: FOR }
      Item[nameItem] = { PSC1: value };
      // outputs=[out_S2_1,out_S2_2]
      outputs = 'OK'
      let upd = await mongodb.update(MAIN_DATA, MAIN, out_S2_1, out_S2_2);

      //no use
    } else {
      let input_S3_1 = findpo[0]; //input1
      let input_S3_2 = output;    //input2
      // let objectR = Object.getOwnPropertyNames(nput_S3_1)
      let nameMF = "FINAL";


      let nameTool = "";
      let buff = input_S3_1[nameMF];
      let objectB = Object.getOwnPropertyNames(buff)
      for (j = 0; j < objectB.length; j++) {
        if (objectB[j] === input_S3_2['tool']) {
          nameTool = objectB[j];
        }
      }
      if (nameTool !== input_S3_2.tool) {
        let nameFOR = input_S3_2['MeasurmentFOR'];
        let nameTool = input_S3_2['tool'];
        let nameItem = input_S3_2['inspectionItem'];
        let value = input_S3_2['value'];
        let Item = {};
        let Tool = {};
        let FOR = input_S3_1[nameFOR];

        Item[nameItem] = { PSC1: value };
        input_S3_1[nameFOR][nameTool] = Item;
        let out_S3_1 = { PO: input_S3_2.PO };
        let out_S3_2 = { $set: input_S3_1 }

        outputs = 'OK'
        let upd = await mongodb.update(MAIN_DATA, MAIN, out_S3_1, out_S3_2);

      } else {
        let input_S4_1 = findpo[0]; //input1
        let input_S4_2 = output;    //input2
        let nameMF = "FINAL";

        let buff = input_S4_1[nameMF];
        let objectB = Object.getOwnPropertyNames(buff)
        for (j = 0; j < objectB.length; j++) {
          if (objectB[j] === input_S4_2.tool) {
            nameTool = objectB[j];
          }
        }

        let nameItem = "";
        let buff21 = input_S4_1[nameMF];
        let buff2 = buff21[nameTool];
        let objectI = Object.getOwnPropertyNames(buff2)
        for (k = 0; k < objectI.length; k++) {
          if (objectI[k] === input_S4_2.inspectionItem) {
            nameItem = objectI[k];
          }
        }

        if (input_S4_2.inspectionItem !== nameItem) {
          let nameFOR = input_S4_2['MeasurmentFOR'];
          let nameTool = input_S4_2['tool'];
          let nameItem = input_S4_2['inspectionItem'];
          let value = input_S4_2['value'];
          let FOR = input_S4_1[nameFOR];
          let Tool = FOR[nameTool];
          let Item = Tool
          Item[nameItem] = { PSC1: value };
          let out_S4_1 = { PO: input_S4_2.PO };
          let out_S4_2 = { $set: input_S4_1 }

          outputs = 'OK'
          let upd = await mongodb.update(MAIN_DATA, MAIN, out_S4_1, out_S4_2);

        } else {

          let nameFOR = input_S4_2.MeasurmentFOR;
          let nameTool = input_S4_2.tool;
          let nameItem = input_S4_2.inspectionItem;
          let value = input_S4_2.value;

          let FOR = input_S4_1[nameFOR];
          let Tool = FOR[nameTool];
          let Item = Tool

          let nItem = Object.getOwnPropertyNames(Item[nameItem]).length
          let timeStamp = `PSC${nItem + 1}`
          let buff = Item[nameItem];
          buff[timeStamp] = value;
          let out_S4_1 = { PO: input_S4_2.PO };
          let out_S4_2 = { $set: input_S4_1 }
          outputs = 'OK'
          let upd = await mongodb.update(MAIN_DATA, MAIN, out_S4_1, out_S4_2);

        }

      }

    }

  }
  //-------------------------------------
  res.json(outputs);
});

router.post('/FINISHtoDB-apr', async (req, res) => {
  //-------------------------------------
  console.log('--FINISHtoDB--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = input;
  //-------------------------------------
  let outputs = '';
  let findpo = await mongodb.find(MAIN_DATA, MAIN, { "PO": input['PO'] });
  if (findpo.length === 0) {
    let nameFOR = input['MeasurmentFOR'];
    let nameTool = input['tool'];
    let nameItem = input['inspectionItem'];
    let value = input['value'];
    let Item = {};
    let Tool = {};

    Item[nameItem] = { "PSC1": value,"PSC2": value,"PSC3": value,"PSC4": value,"PSC5": value ,"PSC6": value,"PSC7": value,"PSC8": value,"PSC9": value,"PSC10": value};
    Tool[nameTool] = Item;

    output[nameFOR] = Tool;
    output['dateG'] = new Date();
    output['dateGSTR'] =day;

    delete output['MeasurmentFOR'];
    delete output['tool'];
    delete output['inspectionItem'];
    delete output['value'];
    delete output['pieces'];
    //----new
    delete output['INS'];
    delete output['inspectionItemNAME'];
    delete output['ItemPick'];
    delete output['ItemPickcode'];
    delete output['POINTs'];
    delete output['PCS'];
    delete output['PCSleft'];
    delete output['UNIT'];
    delete output['INTERSEC'];
    delete output['preview'];
    delete output['confirmdata'];
    delete output['ITEMleftUNIT'];
    delete output['ITEMleftVALUE'];


    let findcp = await mongodb.find(PATTERN, PATTERN_01, { "CP": input['CP'] });
    let masterITEMs = await mongodb.find(master_FN, ITEMs, {});
    let MACHINEmaster = await mongodb.find(master_FN, MACHINE, {});

    let ItemPickcodeout = [];
    for (i = 0; i < findcp[0]['FINAL'].length; i++) {
      for (j = 0; j < masterITEMs.length; j++) {
        if (findcp[0]['FINAL'][i]['ITEMs'] === masterITEMs[j]['masterID']) {
          ItemPickcodeout.push({ "key": masterITEMs[j]['masterID'], "value": masterITEMs[j]['ITEMs'], "METHOD": findcp[0]['FINAL'][i]['METHOD'] });
        }
      }
    }

    output['CHECKlist'] = ItemPickcodeout;

    let insertdb = await mongodb.insertMany(MAIN_DATA, MAIN, [output]);

    outputs = 'OK';
  } else {

    console.log("---->");
    let input_S2_1 = findpo[0]; //input1
    let input_S2_2 = output;     //input2
    let objectR = Object.getOwnPropertyNames(input_S2_1)
    let findMF = false;

    for (i = 0; i < objectR.length; i++) {
      if (objectR[i] === input_S2_2['MeasurmentFOR']) {
        findMF = true;
      }
    }
    if (findMF === false) {
      let nameFOR = input_S2_2['MeasurmentFOR'];
      let nameTool = input_S2_2['tool'];
      let nameItem = input_S2_2['inspectionItem'];
      let value = input_S2_2['value'];
      let Item = {};
      let Tool = {};
      let FOR = {};
      Tool[nameTool] = Item;
      FOR[nameFOR] = Tool;
      let out_S2_1 = { "PO": input_S2_2.PO };
      let out_S2_2 = { $set: FOR }
      Item[nameItem] = {  "PSC1": value,"PSC2": value,"PSC3": value,"PSC4": value,"PSC5": value ,"PSC6": value,"PSC7": value,"PSC8": value,"PSC9": value,"PSC10": value};
      // outputs=[out_S2_1,out_S2_2]
      outputs = 'OK'
      let upd = await mongodb.update(MAIN_DATA, MAIN, out_S2_1, out_S2_2);

      //no use
    } else {
      let input_S3_1 = findpo[0]; //input1
      let input_S3_2 = output;    //input2
      // let objectR = Object.getOwnPropertyNames(nput_S3_1)
      let nameMF = "FINAL";


      let nameTool = "";
      let buff = input_S3_1[nameMF];
      let objectB = Object.getOwnPropertyNames(buff)
      for (j = 0; j < objectB.length; j++) {
        if (objectB[j] === input_S3_2['tool']) {
          nameTool = objectB[j];
        }
      }
      if (nameTool !== input_S3_2.tool) {
        let nameFOR = input_S3_2['MeasurmentFOR'];
        let nameTool = input_S3_2['tool'];
        let nameItem = input_S3_2['inspectionItem'];
        let value = input_S3_2['value'];
        let Item = {};
        let Tool = {};
        let FOR = input_S3_1[nameFOR];

        Item[nameItem] = {  "PSC1": value,"PSC2": value,"PSC3": value,"PSC4": value,"PSC5": value ,"PSC6": value,"PSC7": value,"PSC8": value,"PSC9": value,"PSC10": value };
        input_S3_1[nameFOR][nameTool] = Item;
        let out_S3_1 = { PO: input_S3_2.PO };
        let out_S3_2 = { $set: input_S3_1 }

        outputs = 'OK'
        let upd = await mongodb.update(MAIN_DATA, MAIN, out_S3_1, out_S3_2);

      } else {
        let input_S4_1 = findpo[0]; //input1
        let input_S4_2 = output;    //input2
        let nameMF = "FINAL";

        let buff = input_S4_1[nameMF];
        let objectB = Object.getOwnPropertyNames(buff)
        for (j = 0; j < objectB.length; j++) {
          if (objectB[j] === input_S4_2.tool) {
            nameTool = objectB[j];
          }
        }

        let nameItem = "";
        let buff21 = input_S4_1[nameMF];
        let buff2 = buff21[nameTool];
        let objectI = Object.getOwnPropertyNames(buff2)
        for (k = 0; k < objectI.length; k++) {
          if (objectI[k] === input_S4_2.inspectionItem) {
            nameItem = objectI[k];
          }
        }

        if (input_S4_2.inspectionItem !== nameItem) {
          let nameFOR = input_S4_2['MeasurmentFOR'];
          let nameTool = input_S4_2['tool'];
          let nameItem = input_S4_2['inspectionItem'];
          let value = input_S4_2['value'];
          let FOR = input_S4_1[nameFOR];
          let Tool = FOR[nameTool];
          let Item = Tool
          Item[nameItem] = {  "PSC1": value,"PSC2": value,"PSC3": value,"PSC4": value,"PSC5": value ,"PSC6": value,"PSC7": value,"PSC8": value,"PSC9": value,"PSC10": value };
          let out_S4_1 = { PO: input_S4_2.PO };
          let out_S4_2 = { $set: input_S4_1 }

          outputs = 'OK'
          let upd = await mongodb.update(MAIN_DATA, MAIN, out_S4_1, out_S4_2);

        } else {

          let nameFOR = input_S4_2.MeasurmentFOR;
          let nameTool = input_S4_2.tool;
          let nameItem = input_S4_2.inspectionItem;
          let value = input_S4_2.value;

          let FOR = input_S4_1[nameFOR];
          let Tool = FOR[nameTool];
          let Item = Tool

          let nItem = Object.getOwnPropertyNames(Item[nameItem]).length
          let timeStamp = `PSC${nItem + 1}`
          let buff = Item[nameItem];
          buff[timeStamp] = value;
          let out_S4_1 = { PO: input_S4_2.PO };
          let out_S4_2 = { $set: input_S4_1 }
          outputs = 'OK'
          let upd = await mongodb.update(MAIN_DATA, MAIN, out_S4_1, out_S4_2);

        }

      }

    }

  }
  //-------------------------------------
  res.json(outputs);
});




//let objectR = Object.getOwnPropertyNames(input_S2_1)

module.exports = router;