'use strict'
const express = require("express")

const bookingDetailController = require("../controllers/BookingDetailController")
const router = new express.Router()

router.get("/", bookingDetailController.getAllBookingDetail)
router.delete("/delete/:id_bo_detail", bookingDetailController.deleteBookingDetail)
router.post("/find/bo_date", bookingDetailController.findBookingDetail)

module.exports = router