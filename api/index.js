const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
const path = require('path');
const multer = require('multer')
var cookieParser = require('cookie-parser')

const { run } = require('../utilities/dbConnect');

require('dotenv').config()


run();

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173','https://helpful-rabanadas-31dcf2.netlify.app'],
    credentials: true,
}))
app.use(cookieParser('secret'));

//Routes
const categoryRoutes = require('../routes/category.route')
const productRoutes = require('../routes/product.route')
const imageUploadRoutes = require('../routes/image.router')
const usersRoutes = require('../routes/user.route')
const paymentRoutes = require('../routes/payment.route')

app.use('/category', categoryRoutes)
app.use('/products', productRoutes)
app.use('/imageUpload', imageUploadRoutes)
app.use('/users', usersRoutes)
app.use('/api', paymentRoutes)


const UPLOADS_FOLDER = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOADS_FOLDER));

app.get("/", async (req, res) => {
    res.send('Ecommerce server running')
})


//handle express error
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            if (err.code) {
                res.send({ success: false, message: 'File is too large. Max size is 1MB.' })
            } else {
                res.send({ success: false, message: 'There was an upload error' })
            }

        } else {
            res.send(err.message)
        }
    } else {

        res.send("success")
    }
})

app.listen(port, () => {
    console.log(`ecommerce server running on ${port}`)
})


