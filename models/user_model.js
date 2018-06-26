import db from '../config/db'
import crypto from 'crypto';
import moment from 'moment';
import userSchema from '../schemas/userSchema'
const User = db.model('User', userSchema.userSchema)
const pwd = ''
const tomodel = {}
export default class userModel{
    getUsers = (data, callback) => {
        User.find({},{_id:1,email:1,user_address:1,eth_address:1},(err, doc)=>{
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
        
    }

    postRegister = function(data, callback) {

        this.pwd = crypto.createHash("md5")
          .update(data.password)
          .digest('hex');
      
      
        User.findOne({
            email: data.email
          }).exec()
          .then((user) => {
      
            if (user != null) {
      
              throw ({
                err_obj: 2
              })
      
            } else {
      
              this.tomodel = {}
              this.tomodel.email = data.email
              this.tomodel.password = this.pwd
              this.tomodel.access_token = data.access_token
              data.password = this.pwd
              this.tomodel.first_name = (data.firstname !== undefined) ? data.firstname : ''
              this.tomodel.last_name = (data.lastname !== undefined) ? data.lastname : ''
            
              let user_data = new User(this.tomodel)
              console.log(user_data)
              user_data.save()
              return callback(null, data)
      
            }
      
          }).catch((err) => {
      
            if (err.err_obj) {
              callback(null, null)
            } else {
      
              callback(err, null)
            }
      
          })
    }


    updateHashAddress = (data, callback) => {
        
        User.findOneAndUpdate({
          email: data.email
        }, {
          user_address: data.user_address,
          address_public_key: data.address_public_key,
          address_private_key: data.address_private_key,
          address_wif: data.wif,
          eth_address: data.eth_address,
          eth_private_key: data.eth_private_key
        }, {
          upsert: false
        },(err,doc) =>{
          if(err){
            callback(err, null)
          }
          callback(null, doc)
        })

    }

    postLogin = (data, callback) => {

        this.pwd = crypto.createHash("md5")
          .update(data.password)
          .digest('hex');
      
      
        User.findOne({
            email: data.email,
            password: this.pwd
          }).exec()
          .then(function(doc) {
      
            if (doc === null) {
      
              throw ({
                err_obj: 2
              })
      
            } else {
              return callback(null, doc)
            }
      
          }).catch(function(err) {
            if (err.err_obj) {
              callback(null, null)
            } else {
      
              callback(err, null)
            }
      
          })
    }


    updateToken = (data, callback) =>{
  
        User.findOneAndUpdate({
          email: data.email
        }, {
          access_token: data.access_token
        }, {
          upsert: false
        },(err,doc) =>{
          if(err){
            callback(err, null)
          }
          callback(null, doc)
        })
    }

    getUserHashAddressByToken = (data, callback) =>{
        User.findOne({
          access_token: data.access_token
        }, (err, doc) =>{
            if(err){
              callback(err, null)
            }else{
    
              callback(null, doc)
            }
        })
    }

}