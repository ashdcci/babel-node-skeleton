import chatModel from '../models/chat_model';
import userModel from '../models/user_model';
import async from 'async';
const tomodel = {}
const chat_model = new chatModel()
const user_model = new userModel()

export default class chatController{
    constructor(){
        this.chat = chat_model
        this.user = user_model
    }

    insertMessage = (req, res) =>{
        if(!req.body.recr_name || !req.body.message){
            return res.status(401).json({
                status: 0,
                message:'required field missing'
            })
        }

        tomodel.sender_name = req.headers['first_name']
        tomodel.recr_name = req.body.recr_name
        tomodel.message = req.body.message

        chat_model.insertMessage(tomodel, (err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message: 'problam in saving data'
                })
            }
            return res.status(200).json({
                status: 1,
                message: 'message saved' 
            })
        })


        return
    }

    fetchSingleThread = (req, res) =>{
        console.log(req.params.recr_name)
        if(!req.params.recr_name){
            return res.status(401).json({
                status: 0,
                message: 'required fields are missing'
            })
        }
        tomodel.sender_name = req.headers['first_name']
        tomodel.recr_name = req.params.recr_name 

        chat_model.fetchSingleThread(tomodel,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message:'prblam in fetching single thread'
                })
            }

            return res.status(200).json({
                status:1,
                message:'latest message',
                data:rows
            })

        })


    }


    fetchAllThread = (req, res) =>{
        if(!req.headers['first_name']){
            return res.status(401).json({
                status: 0,
                message: 'required fields are missing'
            })
        }
        tomodel.user_name = req.headers['first_name']
        tomodel._id = req.headers['user_id']
        chat_model.fetchAllThread(tomodel,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message:'prblam in fetching single thread'
                })
            }

            return res.status(200).json({
                status:1,
                message:'latest threads',
                data:rows
            })

        })
    }


    deleteThread = (req, res) =>{
        if(!req.body.threadId){
            return res.status(401).json({
                status:0,
                message:'message_id is missing'
            })
        }

        tomodel.threadId = req.body.threadId
        tomodel._id = req.headers['user_id']
        chat_model.deleteThread(tomodel,(err, rows)=>{
            if(err){
                return res.status(500).json({
                    status:0,
                    message:'problam in deleting message'
                })
            }

            return res.status(200).json({
                status:1,
                message:'message deleted'
            })

        })
    }

    deleteMessage = (req, res) =>{
        if(!req.body.messageId){
            return res.status(401).json({
                status:0,
                message:'message_id is missing'
            })
        }
        tomodel.messageId = req.body.messageId
        tomodel._id = req.headers['user_id']
        chat_model.deleteMessage(tomodel,(err, rows)=>{
            if(err){
                return res.status(500).json({
                    status:0,
                    message:'problam in deleting message'
                })
            }

            return res.status(200).json({
                status:1,
                message:'message deleted'
            })

        })
        
    }

    readMessage = (req, res) =>{
        if(!req.body.messageId){
            return res.status(401).json({
                status:0,
                message:'message_id is missing'
            })
        }
        tomodel.messageId = req.body.messageId
        tomodel._id = req.headers['user_id']
        chat_model.readMessage(tomodel,(err, rows)=>{
            if(err){
                return res.status(500).json({
                    status:0,
                    message:'problam in deleting message'
                })
            }

            return res.status(200).json({
                status:1,
                message:'message deleted'
            })

        })
    }
    
    searchUserForRoom = (req, res) =>{
        tomodel.search_str = (req.body.search!==undefined) ? req.body.search : ''
        user_model.findUserForRoom(tomodel, (err, rows) =>{
            if(err){
                return res.status(500).json({
                    status : 0,
                    message : 'problam in fetch user'
                })
            }

            return res.status(200).json({
                status: 1,
                message: 'user data',
                count : rows.length,
                user_data: rows
            })
        })
    }

}