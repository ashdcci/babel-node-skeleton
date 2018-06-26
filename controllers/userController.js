import jwt from 'jsonwebtoken';
import user_model from '../models/user_model';
import async from 'async';
import crypto from 'crypto';
import web3 from '../config/web3';
import bcapi from '../config/bcpi';
const superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
const data = {}
const tomodel = {}
const userModel = new user_model()

export default class userController{
    
    constructor(){

    }
    
    getUser = (req, res, next) =>{
        userModel.getUsers({'user':'abcd@yopmail.com'},(err, doc)=>{

            if(err){
                return res.status(500).json({
                    status: 0,
                    message:'Problam in fetch data'
                })
            }else{
                return res.status(200).json({
                    status: 1,
                    message:'User List',
                    data:doc
                })
            }
            
        })
        return 
    }


    register = (req, res, next) =>{
        if(!req.body.email || !req.body.password){
            return res.status(400).json({
              status:0,
              msg:'required field are missing'
            })
          }
    
            req.body.access_token = this.createToken(req.body.email)
            this.tomodel = {}
    
            userModel.postRegister(req.body,(err,rows) =>{
                if(err){
                    return res.status(500).json({"status":0,"messages":{"location":"body","param":"email","msg":"Internal Error has Occured"}})
                }
    
                if(rows==null){
                  return res.status(401).json({"status":0,"messages":{"location":"body","param":"email","msg":"This Email already Exist into System"}})
                }
                console.log(err, rows)
                this.createAddress(rows.email, req, res, next)
                // return res.json({status:1,messages:"Register Successfully",data:rows})
    
            });
    
            return
    }

        /**
     * <b>Gen Addr</b>
     * Generates a new address and associate private/public keys.
     * @param {Object}   data    Optional JSON data, which could be used for generating multisig addresses, for exampl.JSON data, which could be used for generating multisig addresses, for example.
     * @callback cb
     * @method genAddr
     */
    createAddress = async (email, req, res, next) =>{
        this.tomodel = {}
        
        
        try{
            let account = await web3.eth.accounts.create(web3.utils.randomHex(32))
    
            bcapi.genAddr({},function(err, rows){
    
            if(err){
                return res.json({status: 0,messages: 'error into generating address' })
            }
    
    
            tomodel.email = email
            tomodel.user_address = rows.address
            tomodel.address_public_key = rows.public
            tomodel.address_private_key = rows.private
            tomodel.wif = rows.wif
            tomodel.eth_address = (account.address!==undefined) ? account.address : '---' 
            tomodel.eth_private_key = (account.privateKey!==undefined) ? account.privateKey : '---'
            req.body.desti_address = tomodel.eth_address
            console.log(tomodel)
            userModel.updateHashAddress(tomodel,(err1, doc) =>{
                if(err1){
                return res.json({status: 0,messages: 'error into updating address' })
                }
                doc.eth_address = tomodel.eth_address
                return res.json({status:1,messages:"Register Successfully",data:doc})
                //  next()
            })
    
            })
    
        }catch(err1){
            console.log(err1)
            return res.json({status: 0,messages: 'error into updating address' })
        }
    
        return
    }

    createToken = (id) => {

        var exp_time = Math.floor(Date.now() / 1000) + (3600 * 3600);
        var token = jwt.sign({
          exp: exp_time,
          data: id + Math.floor((Math.random() * 1000000000) + 1).toString()
        }, superSecret);
        return token;
      
    }


    login = (req, res, next) =>{
        if(!req.body.email || !req.body.password){
            return res.status(400).json({
              status:0,
              msg:'required field are missing'
            })
          }
      
          this.tomodel = {}
      
          userModel.postLogin(req.body,function(err,rows){
              if(err){
                  return res.status(500).json({"status":0,"messages":{"location":"body","param":"email","msg":"Internal Error has Occured"}})
              }
      
              if(rows==null){
                return res.status(401).json({"status":0,"messages":{"location":"body","param":"email","msg":"This Email is not Exist into System"}})
              }
              req.body.user_data = rows 
              next()
              // return res.status(200).json({status:1,messages:"Login Successfully",data:rows})
      
        });
    }

    updateToken = (req, res, next) =>{
        if(!req.body.email || !req.body.password){
          return res.status(400).json({
            status:0,
            msg:'required field are missing'
          })
        }
    
        this.tomodel = {}
        req.body.access_token = this.createToken(req.body.email)
        userModel.updateToken(req.body, (err, rows) =>{
          if(err){
            return res.json({status: 0,messages: 'error into updating token' })
          }
    
          req.body.user_data.access_token = req.body.access_token
    
          let user_data = req.body.user_data
    
          return res.status(200).json({status:1,messages:"Login Successfully",data:user_data})
        })
    
    }

}