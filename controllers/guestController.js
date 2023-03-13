const jsonwebtoken = require("jsonwebtoken")
const md5 = require('md5')
const Sequelize = require("sequelize")
const SECRET_KEY = "secretcode"

const model = require("../models/index")
const guest = model.guest

const register = async (req, res) => {
    try {
        let data = {
            guest_name: req.body.guest_name,
            email: req.body.email,
            password: md5(req.body.password),
            image: req.file.filename
        }

        await guest.create(data)
        return res.status(200).json({
            "message": "Success register customer",
            "data": {
                guest_name: data.guest_name,
                email: data.email,
                password: data.password,
                image: data.image,
            },
            "code": 200
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const login = async (req, res) => {
    try {
        const params = {
            email: req.body.email,
            password: md5(req.body.password)
        }

        const findGuest = await guest.findOne({ where: params })
        if (findGuest == null) {
            return res.status(404).json({
                message: "username or password doesn't match",
                code: 404
            })
        }
        //generate jwt token
        let tokenPayload = {
            id_guest: findGuest.id_guest,
            email: findGuest.email,
            role: "guest"
        }
        tokenPayload = JSON.stringify(tokenPayload)
        let token = await jsonwebtoken.sign(tokenPayload, SECRET_KEY)

        //result
        return res.status(200).json({
            message: "Success login",
            data: {
                token: token,
                id_guest: findGuest.id_guest,
                email: findGuest.email,
                role: "customer"
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const updateGuest = async (req, res) => {
    try {
        const params = {
            id_guest: req.params.id_guest
        }
        const data_edit = {
            guest_name: req.body.guest_name,
            email: req.body.email
        }

        const result = await guest.findOne({where : params})
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        if (req.file) {
            try {
                const oldFileName = result.image;

                //delete old file
                const dir = path.join(__dirname, "../uploads/image", oldFileName);
                fs.unlink(dir, (err) => console.log(err));
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error while update file",
                    err: err,
                });
            }

            //set new image
            data_edit.image = req.file.filename;
        }

        await guest.update(data_edit, { where: params })
        return res.status(200).json({
            message: "Success update customer",
            code: 200
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}
const deleteGuest = async (req, res) => {
    try {
        const params = {
            id_guest: req.params.id_guest
        }
        const result = await guest.findOne({ where : params})
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        await guest.destroy({ where: params })
        return res.status(200).json({
            message: "Success to delete customer",
            code: 200
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const findAllGuest = async (req, res) => {
    try {
        const result = await guest.findAll()
        return res.status(200).json({
            message: "Succes to get all customer",
            code: 200,
            count: result.length,
            data: result
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const findOneGuest = async (req, res) => {
    try {
        const params = {
            id_guest: req.params.id_guest
        }
        const result = await guest.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        return res.status(200).json({
            message: "Success to get one customer",
            code: 200,
            data: result
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

module.exports = {
    login,
    register,
    updateGuest,
    deleteGuest,
    findAllGuest,
    findOneGuest
}