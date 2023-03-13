const { Console } = require('console')
const fs = require('fs')
const path = require("path")

const model = require("../models/index")
const tipeKamar = model.tipe_kamar

const addTipeKamar = async (req,res) => {
    try{
        //ini buat req data yang nantinya diinput di postman
    const data = {
        nama_tipe_kamar : req.body.nama_tipe_kamar,
        harga : req.body.harga,
        deskripsi: req.body.deskripsi,
        foto: req.file.filename //ini untuk add file (photo)
    }

    //ini query add ke db
    const result = await tipeKamar.create(data);
    return res.status(200).json({
        message : "Sukses menambahkan data tipe kamar",
        code: 200,
        data: result
    })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message : "Internal Error",
            err: err
        })
        
    }
}

const updateTipeKamar = async (req,res) => {
    try {
        const params = {
            id_tipe_kamar: req.params.id_tipe_kamar,
        };

        const data_edit = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        };

        const result = await tipeKamar.findOne({where: params});
        if (result == null) {
            return res.status(404).json({
                message: "Data tidak ditemukan!"
            });
        }

        if (req.file) {
            try {
                const oldFileName = result.foto;

                const dir = path.join(_dirname, "./uploads", oldFileName);
                fs.unlink(dir, (err) => console.log(err));
            }catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error ketika mengupdate file",
                    err: err,
                });
            }

            data_edit.photo = req.file.filename;
        }

        await tipeKamar.update(data_edit, {where:params});
        return res.status(200).json({
            message: "sukses mengupdate tipe kamar",
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

const deleteTipeKamar = async (req, res) => {
    try {
        const params = {
            id_tipe_kamar: req.params.id_tipe_kamar,
        };
        const result = await tipeKamar.findOne({ where: params });
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        // try {
        //     const oldFileName = result.photo;

        //     //delete old file
        //     const dir = path.join(__dirname, "../uploads/image", oldFileName);
        //     fs.unlink(dir, (err) => console.log(err));
        // } catch (err) {
        //     console.log(err);
        // }

        await tipeKamar.destroy({ where: params });
        return res.status(200).json({
            message: "Berhasil menghapus tipe kamar",
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

const getAllTipeKamar = async (req, res) => {
    try{
        const result = await tipeKamar.findAll();
        return res.status(200).json({
            message: "Berhasil mendapat semua tipe kamar",
            code: 200,
            count: result.length,
            data: result,
        });
    }catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal eror",
            err: err,
        });
    }
}

const getOneTipeKamar = async (req, res) => {
    try {
        const params = {
            id_tipe_kamar: req.params.id_tipe_kamar,
        };
        const result = await tipeKamar.findOne({ where: params });
        if (result == null) {
            return res.status(404).json({
                message: "Data tidak ditemukan!"
            });
        }
        
        return res.status(200).json({
            message: "Berhasil mendapatkan satu tipe kamar",
            code: 200,
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

module.exports = {
    addTipeKamar,
    updateTipeKamar,
    deleteTipeKamar,
    getAllTipeKamar,
    getOneTipeKamar
}
