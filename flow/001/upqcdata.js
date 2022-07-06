const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');


//TPG-HRC-004
//TPG-HRC-005
//TPG-HMV-002
//TPG-HMV-003
//TPG-HVK-003
//TPG-MCS-001

//TPG-SRT-001

router.post('/upqcdata',async (req,res) => {
    //-------------------------------------
    console.log('--upqcdata--');
    console.log(req.body);
    //-------------------------------------
    
    
    //-------------------------------------
      return  res.json(output);
});


module.exports = router;