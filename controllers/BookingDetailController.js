const model = require("../models/index");
const bookingOrderDetail = model.booking_order_detail;
const sequelize = require("sequelize")

const Op = sequelize.Op

const getAllBookingDetail = async (req, res) => {
    try {
        const result = await bookingOrderDetail.findAll({
            include: ["booking_order", "kamar"],
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

const findBookingDetail = async (req, res) => {
    try {
        const keyword = new Date(req.body.keyword)
        // const accessDate = req.body.access_date

        const result = await bookingOrderDetail.findAll({
            include: ["booking_order", "kamar"],
            where: {
                [Op.or]: {
                    duration: { [Op.like]: `%${keyword}%` }
                }
            }
        })

        return res.status(200).json({
            message: "Succes to get booking",
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

const deleteBookingDetail = async (req, res) => {
    try {
        const params = {
            id_bo_detail: req.params.id_bo_detail
        }

        const findData = await bookingOrderDetail.findOne({ where: params })
        if (findData == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        await bookingOrderDetail.destroy({ where: params })
        return res.status(200).json({
            message: "Succes to delete detail booking",
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
    getAllBookingDetail,
    findBookingDetail,
    deleteBookingDetail
};