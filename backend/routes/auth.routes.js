const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");


router.post("/auth/signin", authCtrl.signin);
router.get("/auth/signout", authCtrl.signout);


module.exports = router;