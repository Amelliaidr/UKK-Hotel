'use strict'
const express = require('express')

const router = new express.Router()

const tipeKamarController = require("../controllers/tipeKamarController")
const {upload} = require("../utils/upload")

router.post("/add", upload.single("foto"), tipeKamarController.addTipeKamar)
router.put("/update/:id_tipe_kamar", upload.single("foto"), tipeKamarController.updateTipeKamar)
router.delete("/delete/:id_tipe_kamar", tipeKamarController.deleteTipeKamar)
router.get("/", tipeKamarController.getAllTipeKamar)
router.get("/:id_tipe_kamar", tipeKamarController.getOneTipeKamar)


module.exports = router



