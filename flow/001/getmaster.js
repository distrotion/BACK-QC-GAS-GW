const express = require("express");
const { kill } = require("nodemon/lib/monitor/run");
const router = express.Router();
let mongodb = require('../../function/mongodb');

let PATTERN = 'PATTERN';
let PATTERN_01 = 'PATTERN_01';
let master_FN = 'master_FN';
let METHOD = 'METHOD';
let MACHINE = 'MACHINE'

router.post('/getmaster', async (req, res) => {
  //-------------------------------------
  console.log('--getmaster--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = 'NOK';

  if (input['PO'] !== undefined && input['CP'] !== undefined) {

  }


  //-------------------------------------
  res.json(output);
});

router.post('/GETINSset',async (req,res) => {
  //-------------------------------------
  console.log('--GETINSset--');
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = {};
  let findcp = [];
  let ITEMMETHODlist = [];
  let METHODmaster = [];
  let MACHINEmaster = [];
  let INSLIST = [];
  let INSLISTans = [];


  if ( input['CP'] !== undefined) {
     findcp = await mongodb.find(PATTERN, PATTERN_01, {"CP":input['CP']});
  }
  if(findcp.length>0){
    if(findcp[0]['FINAL'] !== undefined && findcp[0]['FINAL'].length>0){
      for(i=0;i<findcp[0]['FINAL'].length;i++){
        ITEMMETHODlist.push({"ITEMs":findcp[0]['FINAL'][i]['ITEMs'],"METHOD":findcp[0]['FINAL'][i]['METHOD']})
      }

      METHODmaster = await mongodb.find(master_FN, METHOD, {});
      MACHINEmaster = await mongodb.find(master_FN, MACHINE, {});

      for(i=0;i<ITEMMETHODlist.length;i++){
        for(j=0;j<METHODmaster.length;j++){
          if(ITEMMETHODlist[i]['METHOD'] === METHODmaster[j]['METHOD']){
            for(k = 0;k<MACHINEmaster.length;k++){
              if(METHODmaster[j]['METHOD'] === MACHINEmaster[k]['masterID']){
                if(MACHINEmaster[k]['MACHINE'].length>0){
                  INSLIST.push(...MACHINEmaster[k]['MACHINE']);
                }
              }
            }
          }
        }
      }
      INSLISTans = [...new Set(INSLIST)];
    }
  }

    
  //-------------------------------------
    res.json(INSLISTans);
});

//         "PO": "",
//         "CP": "",
//         "QTY": "",
//         "PROCESS": "",
//         "CUSLOT": "",
//         "TPKLOT": "",
//         "FG": "",
//         "CUSTOMER": "",
//         "PART": "",
//         "PARTNAME": "",
//         "MATERIAL": "",



module.exports = router;