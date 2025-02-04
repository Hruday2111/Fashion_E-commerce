// completed

const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    id:Number
})

const cart = mongoose.model('cart',cartSchema)

module.exports = cart