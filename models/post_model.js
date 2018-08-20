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

    addPostToFollowersTimeLine = (data,callback) =>{

        fakeUser.ensureIndexes({_id:1})
        fakeUser.update(
            {'following':{$in:data.username}},
            { $push: {timeline:{$each:[data.latestPostId], $position: 0 } }},
            {multi:true}, 
            (err, doc) =>{
              console.log(err, doc)
              if(err){
                callback(err, null)
              }else{
                callback(null, doc)
              }
              
            })
    }



}