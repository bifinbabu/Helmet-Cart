const db = require('../config/connection')
var collection = require('../config/collections');
const collections = require('../config/collections');
var objectId = require('mongodb').ObjectID;

module.exports = {
    adminDoLogin:(userData)=>{
        return new Promise(async(resolve, reject)=>{
            if(userData.Email == "admin@admin.com" && userData.Password == '123'){
                login = true
                resolve(login)
            }else{
                login = false
                resolve(login)
            }
        })
    }
}