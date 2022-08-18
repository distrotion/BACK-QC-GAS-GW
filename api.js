const express = require("express");
const router = express.Router();

router.use(require("./flow/001/sap"))
router.use(require("./flow/001/getmaster"))
router.use(require("./flow/001/upqcdata"))
router.use(require("./flow/001/1-TPAPPGASGW"))
router.use(require("./flow/001/2-TPGHMV002"))
router.use(require("./flow/001/3-TPGHMV003"))
router.use(require("./flow/001/4-TPGHRC004"))
router.use(require("./flow/001/5-TPGHRC005"))
router.use(require("./flow/001/6-TPGHVK003"))
router.use(require("./flow/001/7-TPGMCS001"))
router.use(require("./flow/001/8-TPGVCP002"))

router.use(require("./flow/001/INSFINISH"))
router.use(require("./flow/001/cleardata"))
router.use(require("./flow/001/GRAPHMASTER"))
//
//INSFINISH
// router.use(require("./flow/004/flow004"))
// router.use(require("./flow/005/flow005"))
router.use(require("./flow/testflow/testflow"))

module.exports = router;

