const Sequelize = require("sequelize");

const model = require("../models/index");
const kamar = model.kamar;
const tipeKamar = model.tipe_kamar
const bookingOrderDetail = model.booking_order_detail

const Op = Sequelize.Op

const addKamar = async (req, res) => {
    try {
        const data = {
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
        };

        await kamar.create(data);
        return res.status(200).json({
            message: "Bershasil menambahkan kamar",
            data: data,
            code: 200,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const updateKamar = async (req, res) => {
    try {
        const params = {
            id_kamar: req.params.id_kamar,
        };

        const data_edit = {
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
        };

        const result = await kamar.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        await kamar.update(data_edit, { where: params });
        return res.status(200).json({
            message: "Berhasil mengupdate kamar",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const deleteKamar = async (req, res) => {
    try {
        const params = {
            id_kamar: req.params.id_kamar,
        };

        const result = await kamar.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        await kamar.destroy({ where: params });
        return res.status(200).json({
            message: "Berhasil menghapus kamar",
            code: 200,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

//get all room include roomType
const findAllKamar = async (req, res) => {
    try {
        const result = await kamar.findAll({
            include: ["tipe_kamar"],
        });

        return res.status(200).json({
            message: "Berhasil mendapatkan semua kamar",
            code: 200,
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

//findAllRoom berdasarkan roomtype
const findRoomByIdRoomType = async (req, res) => {
    try {
        const params = {
            id_tipe_kamar: req.params.id_tipe_kamar,
        };

        const resultTipeKamar = await tipeKamar.findOne({ where: params })
        if (resultTipeKamar == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        const result = await kamar.findAll({
            include: ["tipe_kamar"],
            where: params,
        });

        return res.status(200).json({
            message: "Berhasil mendapatkan kamar by tipe kamar",
            code: 200,
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

const findRoomByFilterDate = async (req, res) => {
    const checkInDate = req.body.checkIn_date
    const checkOutDate = req.body.checkOut_date

    const kamarData = await tipeKamar.findAll({
        attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        include: [
            {
                model: kamar,
                as: "kamar"

            }
        ]
    })

    const roomBookedData = await tipeKamar.findAll({
        atrributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        include: [
            {
                model: kamar,
                as: "kamar",
                include : [
                    {
                        model : bookingOrderDetail,
                        as : "booking_order_detail",
                        attributes : ["duration"],
                        where: {
                            duration: {
                                [Op.between] : [checkInDate, checkOutDate]
                            }
                        }
                    }
                ]
            }
        ]
    })

    const available = []
    const availableByType = []

    for(let i=0; i < kamarData.length; i++){
        kamarData[i].kamar.forEach((kamar) => {
            let isBooked = false
            roomBookedData.forEach((booked) => {
                booked.kamar.forEach((bookedRoom) => {
                    if(kamar.id_kamar === bookedRoom.id_kamar){
                        isBooked = true
                    }
                })
            })

            if(!isBooked){
                available.push(kamar)
            }
        })
    }

    for(let i=0; i < kamarData.length; i++){
        let tipeKamar = {}
        tipeKamar.id_tipe_kamar = kamarData[i].id_tipe_kamar
        tipeKamar.nama_tipe_kamar = kamarData[i].nama_tipe_kamar
        tipeKamar.kamar = []
        available.forEach((kamar) => {
            if(kamar.id_tipe_kamar === kamarData[i].id_tipe_kamar){
                tipeKamar.kamar.push(kamar)
            }
        })
        if(tipeKamar.kamar.length > 0){
            availableByType.push(tipeKamar)
        }
    }

    return res.status(200).json({
        message: "Succes to get available room by type room",
        code: 200,
        roomAvailable : available,
        roomAvailableCount : available.length,
        room: availableByType,
        typeRoomCount: availableByType.length
    });

}

    module.exports = {
        addKamar,
        updateKamar,
        deleteKamar,
        findAllKamar,
        findRoomByIdRoomType,
        findRoomByFilterDate
    };