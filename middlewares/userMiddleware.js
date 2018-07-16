import userModel from '../models/user_model'
const user_model = new userModel()


export default class userMiddleware{
    constructor(){

    }

    checkUserName = (req, res, next) =>{
        if(!req.body.recr_name){
            return res.status(400).json({
                status: 0,
                message: 'Receiver Name is missing'
            })
        }
        tomodel.name = req.body.recr_name
        user_model.getNameValidetes(tomodel,(err, doc) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    mesage: 'Problam in validate username'
                })
            }else if(doc === null){
                return res.status(400).json({
                    status: 0,
                    message: 'Receiver Name is invalid'
                })
            }else if(req.headers['first_name']===req.body.recr_name){
                return res.status(400).json({
                    status: 0,
                    message: 'Receiver Name Must not be sender'
                })
            }
    
            next()
        })
    
    
    }

}