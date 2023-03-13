const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 8800

app.use(cors())
app.use(express.static(__dirname))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/tipe-kamar", require("./routes/tipeKamar"))
app.use("/user", require("./routes/user"))
app.use("/kamar", require("./routes/kamar"))
app.use("/guest", require("./routes/guest"))
app.use("/booking", require("./routes/booking"))
app.use("/booking-detail", require("./routes/booking_detail"))

app.listen(PORT, () => {
    console.log(`Server runs on port
    ${PORT}`)
})