'use strict'
const express = require("express")

const kamarController = require("../controllers/kamarController")
const router = new express.Router()
const auth = require("../auth/auth")

router.post("/add", kamarController.addKamar)
router.put("/update/:id_kamar", kamarController.updateKamar)
router.delete("/delete/:id_kamar", kamarController.deleteKamar)
router.get("/", kamarController.findAllKamar)
router.get("/tipe-kamar/:id_tipe_kamar", kamarController.findRoomByIdRoomType)
router.post("/find/available", kamarController.findRoomByFilterDate)

module.exports = router