import jwt from 'jsonwebtoken';
import user_model from '../models/user_model';
import async from 'async';
import crypto from 'crypto';
const superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
const data = {}
const tomodel = {}
import faker from 'faker'
const userModel = new user_model()

export default class utilsController{
    constructor(){
        this.tomodel = tomodel
    }

    insertFakeUser = (req, res, next) =>{
          this.tomodel = {}
        this.tomodel.firstName = faker.name.firstName();
        this.tomodel.lastName = faker.name.lastName();
        this.tomodel.email = faker.internet.email();
        this.tomodel.password = faker.internet.password(8);
        this.tomodel.username = faker.internet.userName();
        this.tomodel.access_token = this.createToken(this.tomodel.email)
            
    
            userModel.postFakeRegister(this.tomodel,(err,rows) =>{
                if(err){
                    return res.status(500).json({"status":0,"messages":{"location":"body","param":"email","msg":"Internal Error has Occured"}})
                }
                if(rows==null){
                  return res.status(401).json({"status":0,"messages":{"location":"body","param":"email","msg":"This Email already Exist into System"}})
                }
                return res.status(200).json({status:1,messages:"Register Successfully",data:rows})           
            });
            return
    }



    followUser = (req, res, next)=>{
        this.tomodel = {}
        this.tomodel.followerId = req.body.followerId
        this.tomodel.userId = req.headers['user_id']


        userModel.followUser(this.tomodel,(err, result) =>{
            if(err || result.ok!=1){
                return res.status(500).json({
                    status: 0
                })
            }

            return res.status(200).json({
                status: 1
            })

        })
        return
    }


    insertTimeLine = (req, res, next) =>{
        this.tomodel = {}
        this.tomodel.postId = Math.floor((Math.random() * 1000000000) + 1).toString()
        userModel.addToTimeLine(this.tomodel, (err, result) =>{
            if(err || result.ok!=1){
                return res.status(500).json({
                    status: 0
                })
            }

            return res.status(200).json({
                status: 1
            })
        })

        return 
    }

    createToken = (email) =>{
        let exp_time = Math.floor(Date.now() / 1000) + (3600 * 3600);
        let token = jwt.sign({
          exp: exp_time,
          data: email + Math.floor((Math.random() * 1000000000) + 1).toString()
        }, superSecret);
        return token;
    }


    checkAuthToken = (req, res, next) =>{

        // check header or url parameters or post parameters for token
      let token = req.body.token || req.query.token || req.headers['x-access-token'];
    
      // decode token
      if (token) {
    
        // verifies secret and checks exp
        jwt.verify(token, superSecret, (err, decoded) => {
          if (err) {
            return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            this.tomodel = {}
            tomodel.access_token = token
            
            userModel.getFakeUserHashAddressByToken(tomodel,(err1,doc) =>{
                
                if(err1){
                  return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
                }else if(doc==null){
                  return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
                }
                
                req.headers['user_id'] = doc._id
                req.headers['username'] = doc.username
                console.log(req.headers)
                next();
    
            })
            return
          }
        });
    
      } else {
    
        // if there is no token
        // return an error
        return res.status(403).json({
            success: 0,
            message: 'No token provided.'
        });
    
      }
    
    }

}
