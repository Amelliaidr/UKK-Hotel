'use strict'
const express = require("express")
const auth= require("../auth/auth")

const bookingController = require("../controllers/BookingController")
const router = new express.Router()

router.post("/add", bookingController.addBookingRoom)
router.put("/update/status/:id_booking_order", bookingController.updateStatusBooking)
router.delete("/delete/:id_booking_order", bookingController.deleteOneBooking)

router.get("/", bookingController.getAllBooking)
router.get("/:id_booking_order", bookingController.getOneBooking)
router.post("/find/bo-number", bookingController.findBookingByBookingNumber)
router.post("/find/filter", bookingController.findBookingDataFilter)
router.get("/guest/:id_guest", bookingController.findBookingByIdGuest)

module.exports = router