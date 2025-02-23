const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    // Temp
    password:{
        type:String,
        required:true
    }
})

const auth = mongoose.model('auth',authSchema)

module.exports = auth