const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');

router.post('/getmaster',async (req,res) => {
    //-------------------------------------
    console.log(req.body);
    //-------------------------------------

    //-------------------------------------
      res.json(output);
});



module.exports = router;