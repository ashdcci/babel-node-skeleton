import db from '../config/db'
import crypto from 'crypto';
import moment from 'moment';
import postSchema from '../schemas/post'
import followerSchema from '../schemas/followers'
import userSchema from '../schemas/userSchema'
const Post = db.model('Post', postSchema.postSchema)
const Followers = db.model('Follower',followerSchema.followerSchema)
const fakeUser = db.model('fakeUser',userSchema.fakeUserSchema)
const pwd = ''
const tomodel = {}
export default class postModel{

    constructor(){
        this.tomodel = tomodel
    }


    addPost = (data, callback)=>{
        this.tomodel.title = data.title
        this.tomodel.body = data.body
        this.tomodel.user_id = db.Types.ObjectId(data.userId)
        this.tomodel.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
        this.tomodel.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
        //Add Post

        let post_data = new Post(this.tomodel)

        post_data.save().then((postData) =>{
            callback(null, postData)
        }).catch((err)=>{
            callback(err, null)
        })
    }


    findPost = (data, callback) =>{
        Post.findOne({title:data.title}).populate('user_id').then((postData)=>{
            callback(null, postData)
        }).catch((err)=>{
            callback(err, null)
        })
    }

    addPostToFollowersTimeLineModel = (data,callback) =>{

        fakeUser.ensureIndexes({_id:1})
        console.log('[*] modal data:',data.userId,data.postId)

        fakeUser.bulkWrite( [
            { updateMany :
               {
                  "filter" : {'following':{$in:[db.Types.ObjectId(data.userId)]}},
                  "update" : { $push: {timeline:{$each:[data.postId], $position: 0 } }}
               }
            }
         ],(err, doc) =>{
              
            if(err){
              callback(err, null)
            }else{
              callback(null, doc)
            }
            
          } )


        // fakeUser.updateMany(
        //     {'following':{$in:[db.Types.ObjectId(data.userId)]}},
        //     { $push: {timeline:{$each:[data.postId], $position: 0 } }},
        //     // {multi:true}, 
        //     (err, doc) =>{
              
        //       if(err){
        //         callback(err, null)
        //       }else{
        //         callback(null, doc)
        //       }
              
        //     })
    }


    getUserTimeLine = (data, callback) =>{

        fakeUser.find({'_id': db.Types.ObjectId(data.userId) },{'email':1,_id:1})
        .populate({
            path: 'timeline',
            select: 'title body user_id created_at',
            sort: { 'timeline.title': -1 },
            // options: {
            //   sort: { 'timeline._id': 1 },
            //   limit: 3
            // },
            populate: { path: 'user_id', select: 'email' }
          })
        // .populate('timeline','_id title body created_at',null, {sort: { 'timeline._id': -1 }})
          .sort({'timeline.title':1})
          .slice('timeline', [0,15])
          .then((postData)=>{

            console.log(postData[0].timeline)
            callback(null, postData)
        }).catch((err)=>{
            console.log(err)
            callback(err, null)
        })

    }



}