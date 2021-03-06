import jwt from 'jsonwebtoken';
import post_model from '../models/post_model';
import async from 'async';
import crypto from 'crypto';
import amqp from '../middlewares/rabbitmq';
const apqpMid = new amqp();
import faker from 'faker'
const superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
const data = {}
const tomodel = {}
 
const postModel = new post_model()



export default class postController{
    constructor(){
        this.tomodel = tomodel
    }

    addPost = (req, res, next) =>{

        this.tomodel.userId = req.headers['user_id'];
        this.tomodel.title = faker.name.title();
        this.tomodel.body = faker.name.jobDescriptor();
        
        
        postModel.addPost(this.tomodel, (err, result)=>{

            console.log(err, result)
            if(err){
                return res.status(500).json({
                    status : 0,
                    msg:'problam in saving post'
                })
            }
            apqpMid.QueueSender(this.tomodel.userId,result._id)
            res.status(200).json({
                status: 1,
                msg: 'Post published on Platform',
                result: result
            })

            
            // this.addPostToFollowersTimeLine(req,result._id,(next)=>{

            //     console.log(next)
            //     if(next == 1){
            //         // return res.status(200).json({
            //         //     status: 1,
            //         //     msg: 'Post published on Platform',
            //         //     result: result
            //         // })
            //     }
            // })

            return false

        })
    }


    rePost = (req, res) =>{
        if(!req.body.postId){
            return res.status(400).json({
                status: 0,
                msg:'postID missing'
            })
        }

        this.tomodel.userId = req.headers['user_id']
        this.tomodel.postId = req.body.postId

        postModel.rePost(this.tomodel, (err, result) =>{
            
            if(err){
                return res.status(500).json({
                    status : 0,
                    msg:'problam in saving post'
                })
            }

            return res.status(200).json({
                status: 1,
                msg: 'Post Data',
                result: result
            })
        })

    }

    findPost = (req, res) =>{

        this.tomodel.title = 'Direct Assurance Orchestrator'
        postModel.findPost(this.tomodel,(err, result) =>{
            
            if(err){
                return res.status(500).json({
                    status : 0,
                    msg:'problam in saving post'
                })
            }

            return res.status(200).json({
                status: 1,
                msg: 'Post Data',
                result: result
            })
        })
    }

    addPostToFollowersTimeLine = (userId,postId,callback) =>{

        this.tomodel = {}
        this.tomodel.latestPostId = postId
        this.tomodel.userId = userId
        
        postModel.addPostToFollowersTimeLine(this.tomodel,(err, results) =>{
            console.log(results)
            if(err){
                console.log('err occured:',err)
            }
        })
        callback(1)
        return
    }



    getUserTimeLine = (req, res) =>{
        this.tomodel = {}
        this.tomodel.userId = req.headers['user_id']

        postModel.getUserTimeLine(this.tomodel, (err, results) =>{
            if(err){
                return res.status(500).json({
                    status : 0
                })
            }

            return res.status(200).json({
                status : 1,
                postData:results
            })

        })
    }


}