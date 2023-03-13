const sequelize = require("sequelize");
const moment = require("moment");

const Op = sequelize.Op;

const model = require("../models/index");
const bookingOrder = model.booking_order;
const bookingOrderDetail = model.booking_order_detail;
const kamar = model.kamar;
const tipeKamar = model.tipe_kamar;
const guest = model.guest;

const addBookingRoom = async (req, res) => {
    try {
        const data = {
            id_user: req.body.id_user,
            id_guest: req.body.id_guest,
            id_tipe_kamar: req.body.id_tipe_kamar,
            bo_number: req.body.bo_number,
            bo_date: req.body.bo_date,
            checkIn_date: req.body.checkIn_date,
            checkOut_date: req.body.checkOut_date,
            guest_name: req.body.guest_name,
            rooms_amount: req.body.rooms_amount,
            bo_status: "new",
        };

        // guest data
        const guestData = await guest.findOne({
            where: { id_guest: data.id_guest }
        })
        if (guestData == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        data.name_guest = guestData.guest_name
        data.email = guestData.email

        // data kamar
        let kamarData = await kamar.findAll({
            where: {
                id_tipe_kamar: data.id_tipe_kamar
            }
        });

        //data tipe kamar
        let tipeKamarData = await tipeKamar.findAll({
            where: { id_tipe_kamar: data.id_tipe_kamar }
        })
        if (tipeKamarData == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        //cek room yang ada pada tabel booking_detail
        let dataBooking = await tipeKamar.findAll({
            where: { id_tipe_kamar: data.id_tipe_kamar },
            include: [
                {
                    model: kamar,
                    as: "kamar",
                    attributes: ["id_kamar", "id_tipe_kamar"],
                    include: [
                        {
                            model: bookingOrderDetail,
                            as: "booking_order_detail",
                            attributes: ["duration"],
                            where: {
                                duration: {
                                    [Op.between]: [data.checkIn_date, data.checkOut_date]
                                }
                            }
                        }
                    ]

                }
            ]
        })

        // get available rooms
        const bookedRoomIds = dataBooking[0].kamar.map((kamar) => kamar.id_kamar)
        const availableRooms = kamarData.filter((kamar) => !bookedRoomIds.includes(kamar.id_kamar))

        //proses add data room yang available to one array
        const roomsDataSelected = availableRooms.slice(0, data.rooms_amount)

        //count day 
        const checkInDate = new Date(data.checkIn_date)
        const checkOutDate = new Date(data.checkOut_date)
        const dayTotal = Math.round((checkOutDate - checkInDate) / (1000 * 3600 * 24))

        //process add booking and detail
        try {
            if (kamarData === null || availableRooms.length < data.rooms_amount || dayTotal === 0 || roomsDataSelected === null) {
                return res.status(404).json({
                    message: "Room not found",
                    code: 404,
                });
            }

            const result = await bookingOrder.create(data)
            //add detail
            for (let i = 0; i < dayTotal; i++) {
                for (let j = 0; j < roomsDataSelected.length; j++) {
                    const accessDate = new Date(checkInDate)
                    accessDate.setDate(accessDate.getDate() + i)
                    const dataDetailBooking = {
                        id_booking_order: result.id_booking_order,
                        id_kamar: roomsDataSelected[j].id_kamar,
                        duration: accessDate,
                        total_price: tipeKamarData[0].harga

                    }
                    await bookingOrderDetail.create(dataDetailBooking)
                }

            }
            return res.status(200).json({
                data: result,
                message: "Success to create booking room",
                code: 200,
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error when create booking",
                err: err,
            });

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const deleteOneBooking = async (req, res) => {
    try {
        const idBooking = req.params.id_booking_order
        const findDataBooking = await bookingOrder.findOne({
            where: { id_booking_order: idBooking }
        })
        if (findDataBooking == null) {
            return res.status(404).json({
                message: "Data not found!",
            });
        }

        const findDataDetailBooking = await bookingOrderDetail.findAll({ where: { id_booking_order: idBooking } })
        if (findDataDetailBooking == null) {
            return res.status(404).json({
                message: "Data not found!",
                err: err,
            });
        }

        await bookingOrderDetail.destroy({ where: { id_booking_order: idBooking } })
        await bookingOrder.destroy({ where: { id_booking_order: idBooking } })

        return res.status(200).json({
            message: "Success to delete booking",
            code: 200,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
}

const updateStatusBooking = async (req, res) => {
    try {
        const params = { id_booking_order: req.params.id_booking_order }

        const result = bookingOrder.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        const data = {
            bo_status: req.body.bo_status
        }

        if (data.bo_status == "check_out") {
            await bookingOrder.update(data, { where: params })

            const updateTglAccess = {
                bo_date: null
            }
            await bookingOrderDetail.update(updateTglAccess, { where: params })
            return res.status(200).json({
                message: "Success update status booking to check out",
                code: 200
            })
        }

        await bookingOrder.update(data, { where: params })
        return res.status(200).json({
            message: "Success update status booking",
            code: 200
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });

    }
}

const getOneBooking = async (req, res) => {
    try {
        const params = {
            id_booking_order: req.params.id_booking_order,
        };

        const result = await bookingOrder.findOne({
            include: [ "guest", "tipe_kamar"],
            where: params,
        });
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        return res.status(200).json({
            message: "Succes to get one booking",
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const getAllBooking = async (req, res) => {
    try {
        const result = await bookingOrder.findAll({
            include: ["tipe_kamar"],
        });

        return res.status(200).json({
            message: "Succes to get all booking",
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

// filter by checkInDate
const findBookingDataFilter = async (req, res) => {
    try {
        const keyword = req.body.keyword
        // const checkInDate = new Date(req.body.checkIn_date);
        // const checkOutDate = new Date(req.body.checkOut_date);

        // const guestData = await guest.findOne({
        //     where: params
        // })
        // if (guestData == null) {
        //     return res.status(404).json({
        //         message: "Data not found!"
        //     });
        // }

        const result = await bookingOrder.findAll({
            include: {
                model: guest,
                as: "guest",
                where: {
                    guest_name: { [Op.like]: `%${keyword}%` }
                }
            }
            // where: {
            //     [Op.or]: {
                    
            //         // email: { [Op.like]: `%${keyword}%` },
            //         // guest_name: { [Op.like]: `%${keyword}%` },
            //         // checkIn_date: {
            //         //     [Op.like]: [checkInDate],
            //         // },
            //     },
            // }
        });

        return res.status(200).json({
            message: "Succes to get all booking by filter",
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const findBookingByBookingNumber = async (req, res) => {
    try {
        const keyword = req.body.keyword;

        const result = await bookingOrder.findAll({
            include: ["tipe_kamar"],
            where: {
                [Op.or]: {
                    bo_number: { [Op.like]: `%${keyword}%` },
                },
            },
        });

        return res.status(200).json({
            message: "Succes to get all booking by booking number",
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const findBookingByIdGuest = async (req, res) => {
    try {
        const params = {
            id_guest: req.params.id_guest
        }

        const guestData = await guest.findOne({
            where: params
        })
        if (guestData == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        const result = await bookingOrder.findAll({ where: params })
        return res.status(200).json({
            message: "Succes to get all booking by id customer",
            count: result.length,
            data: result,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
}

module.exports = {
    addBookingRoom,
    deleteOneBooking,
    updateStatusBooking,
    getAllBooking,
    getOneBooking,
    findBookingDataFilter,
    findBookingByBookingNumber,
    findBookingByIdGuest
};