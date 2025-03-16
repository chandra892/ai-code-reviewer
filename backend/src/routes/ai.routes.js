const express = require("express")
const router = express.Router()
const revController = require("../controller/ai.controller")

router.post("/get-review", revController.getReview );


module.exports= router