const express = require("express");
const router = express.Router();

router.use(require("./flow/001/sap"))
router.use(require("./flow/001/getmaster"))
router.use(require("./flow/001/upqcdata"))
router.use(require("./flow/001/TPAPPGASGW"))
router.use(require("./flow/001/TPGHMV002"))
router.use(require("./flow/001/TPGHMV003"))
router.use(require("./flow/001/TPGHRC004"))
router.use(require("./flow/001/TPGHRC005"))
router.use(require("./flow/001/TPGMCS001"))
router.use(require("./flow/001/INSFINISH"))
router.use(require("./flow/001/cleardata"))
//INSFINISH
// router.use(require("./flow/004/flow004"))
// router.use(require("./flow/005/flow005"))
router.use(require("./flow/testflow/testflow"))

module.exports = router;

