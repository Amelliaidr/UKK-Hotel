'use strict'
const express = require('express')

const guestController = require("../controllers/guestController")
const { upload } = require("../utils/upload")
const router = new express.Router()
const auth = require("../auth/auth")

router.post("/login", guestController.login)
router.post("/register", upload.single("image"), guestController.register)
router.put("/update/:id_guest", upload.single("image"), guestController.updateGuest)
router.delete("/delete/:id_guest", guestController.deleteGuest)
router.get("/", guestController.findAllGuest)
router.get("/:id_guest", guestController.findOneGuest)

module.exports = router