const express = require("express");
const router = express.Router();
var mongodb = require('../../function/mongodb');


router.get('/flow001', async (req, res) => {

    res.json("testflow1");
});

router.post('/sap',async (req,res) => {
    //-------------------------------------
    console.log(req.body);
    //-------------------------------------

    //-------------------------------------
      res.json(output);
});


module.exports = router;
