'use strict'
const express = require('express')

const userController = require("../controllers/userController")
const { upload } = require("../utils/upload")
const router = new express.Router()
const auth = require("../auth/auth")

router.post("/login", userController.login)
router.post("/add", upload.single("foto"), userController.addUser)
router.put("/update/:id_user", auth.authVerify, upload.single("foto"), userController.updateUser)
router.delete("/delete/:id_user", auth.authVerify, userController.deleteUser)
router.get("/", auth.authVerify, userController.findAllUser)
router.get("/:id_user", auth.authVerify, userController.findOneUser)


module.exports = router