import userController from '../controllers/userController'
import transactionController from '../controllers/transactionController'
import chatController from '../controllers/chatController'
import utilsController from '../controllers/utilsController'
import postController from '../controllers/postController'
import getImageUrls  from 'get-image-urls'
import GoogleImages from 'google-images'
const users = new userController();
const transactions = new transactionController();
const utils = new utilsController();
const chat = new chatController()
const post = new postController()

const client = new GoogleImages('006576436780304014295:xlmqlg0pq04', 'AIzaSyCcgQjM3cyPmbM0xPxO6w2CNIcPGK0TFUI');
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import userMiddleware from '../middlewares/userMiddleware'
const authToken = new authTokenMiddleware();
const userProvider = new userMiddleware()


export default (app) =>{
    let data = []
    let page = 1
    function getImageResult(num, callback){
        console.log(num)
        client.search('icecream',{page:num})
                    // getImageUrls('https://www.google.co.in/search?biw=1309&bih=681&tbm=isch&sa=1&q=icecream#imgrc=_')
                    .then(function(images) {
                    // console.log('Images found', images.length);
                    // console.log(images);
                        // return res.json({
                        //     status:1,
                        //     found:images.length,
                        //     data:images
                        // })

                        if(num == 5){
                            // console.log(data)
                            callback(0,data)
                        }else{
                            data.push(images)
                            // console.log(data)
                            num = num + 1
                            getImageResult(num , callback)
                        }

                        // callback(0,[])

                        console.log('data length: ',data.length)
                    })
                    .catch(function(e) {
                    console.log('ERROR', e);
                    })
    }

    app.group('/api/v1/',(router) =>{
        router
            .get('/', users.getUser)
            .get('/urls',(req,res,next) =>{
                
                


                
                getImageResult(page,(chk, result)=>{
                    if(chk==1){
                        // data.push(result)
                        // page+=1;
                        // getImageResult(page)
                    }else{
                        console.log('data:',result)
                        return res.json({
                            status:1,
                            found:data[0].length,
                            data:data[0]
                        })
                    }
                })


                
            })
            .post('/register',users.register)
            .post('/login',users.login,users.updateToken)
            .post('/transactions/getTransaction',authToken.checkAuthToken,transactions.getTransaction)
            .post('/transactions/getEthTransaction',authToken.checkAuthToken,transactions.getEthTransaction)
            .post('/transactions/getTokenTransaction',authToken.checkAuthToken,transactions.getTokenTransaction)
            .post('/chat/search-user',authToken.checkAuthToken,chat.searchUserForRoom)            
            .post('/chat/insert',authToken.checkAuthToken,userProvider.checkUserName,chat.insertMessage)
            .get('/fake-user',utils.insertFakeUser)
            .patch('/follow',utils.followUser)
            .post('/add-post',utils.checkAuthToken,post.addPost)
            .post('/get-post',utils.checkAuthToken,post.findPost)
            .post('/follow',utils.checkAuthToken)
    })

    app.use('*',(req,res,next) =>{
        res.status(404).json({
            status: 0,
            message: 'api call undefined'
        })
    })


};