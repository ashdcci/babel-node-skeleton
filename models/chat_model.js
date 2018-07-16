import db from '../config/db'
import moment from 'moment';
import chatSchema from '../schemas/chatSchema'
const Chat = db.model('Chat', chatSchema.chatSchema)


export default class chatModel {
    constructor(){

    }

    insertMessage = (data,callback) =>{
        Chat.findOne({ 
            '$and':[
                { 'receipent':  data.sender_name },
                { 'receipent':  data.recr_name }
            ]
        }).exec().then((doc) =>{

            if(doc){
                /**
                 *  push into array
                 **/

                let message = {
                    from: data.sender_name,
                    to: data.recr_name,
                    body: data.message,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                return Chat.update(
                    { _id: doc._id },
                    { $push: {message:message} }
                )


            }else{
                /**
                 * make new array
                 */

                let msg = {
                    receipent: [data.sender_name, data.recr_name],
                    // sent: new Date(),
                    message: [{
                        from: data.sender_name,
                        to: data.recr_name,
                        body: data.message,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }],
                }
                //Send a message

                let chat_data = new Chat(msg)

                // return Chat.save(msg)

                chat_data.save()
                return callback(null, data)


            }

        }).then((chat_doc)=>{
            callback(null, chat_doc)
        }).catch(function(err) {

            if (err.err_obj) {
              callback(null, null)
            } else {
      
              callback(err, null)
            }
      
        })
    }


    descendingTimeOrder = (loc1, loc2) => {
        return loc2.created_at.getTime() - loc1.created_at.getTime()
    }

    fetchSingleThread = (data, callback) =>{

        Chat.aggregate([{$match: {
            '$and':[
                { 'receipent':  data.sender_name },
                { 'receipent':  data.recr_name }
            ]
        } }, 
        {$unwind: "$message"}, 
        {$sort: {"message.created_at": -1}},
        {$skip: 0},
        {$limit: 10},
        {"$group": {
            _id : { 
                _id: '$_id', 
                receipent: { $concatArrays : [ "$receipent" ] },
                created_at:"$created_at",
                updated_at:"$updated_at",
            },
            message: {"$push":  "$message"}}},
        {
                $project:{
                    "id":1,
                    "receipent":"$receipent",
                    "message":"$message"
        }
        }])
        .exec((err, doc) =>{
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }


    fetchAllThread = (data, callback) =>{
        
        Chat.aggregate([
            {
                $match: {
                    receipent: { $elemMatch: { $eq: data.user_name } },
                    'is_deleted._id':{$ne:data._id}
                } 
            }, 
            {$unwind: "$message"}, 
            {$sort: {"message.created_at": -1}},
            {$skip: 0},
            {$limit: 10},
            {
                "$group": {
                    _id : { 
                        _id: '$_id', 
                        receipent: { $concatArrays : [ "$receipent" ] },
                        is_deleted:"$is_deleted",
                        created_at:"$created_at",
                        updated_at:"$updated_at",
                    },
                    message: {$push :  {$cond: { if: { $in: [ data._id, '$message.is_deleted._id'] }, then: '$1', else: '$message' } } }
                }
            },
            {
                    $project:{
                        "id":1,
                        is_deleted:"$is_deleted",
                        message1: "$message",
                        message:{$slice:['$message',1]}
                    }
            },
        ])
        .exec((err, doc) =>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }


    deleteMessage = (data,callback) =>{
        
        Chat.update({'message._id':data.messageId},{$addToSet:{'message.$.is_deleted':data._id}}, (err, doc)=>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })

    }

    deleteThread = (data,callback) =>{
        Chat.update({'_id':data.threadId},{$addToSet:{'is_deleted':data._id}}, (err, doc)=>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }

    updateUserNameThread = (data, callback) =>{

        Chat.aggregate(
        [
            {
                $match:{
                    receipent:data.first_name
                }
            },
            {
                $unwind:"$message"
            },
            {
                $project:{
                    _id:1,
                    message:"$message"
                }
            }
        ], (err, docs) =>{

            if(err){
                callback(err, null)
            }else if(docs==null){
                callback(null, null)
            }

            console.log(docs)

            var ops = []
            docs.forEach( (doc)=>{
                
                if(doc.message.from == data.first_name){
                    var set = { "$set": { "message.$.from": data.user_name } }
                }else{
                    var set = { "$set": { "message.$.to": data.user_name } }
                }
                
                ops.push({
                    "updateOne": {
                        "filter": { "message._id": doc.message._id },
                        "update": set
                    }
                });
            })

            if(ops.length > 0){
                Chat.bulkWrite(ops, function(err1, r1) {
                    if(err1){
                        callback(err1,null)
                    }
                    callback(null, r1)

                });
            }else{
                callback(null, null)
            }
        })
    }

}