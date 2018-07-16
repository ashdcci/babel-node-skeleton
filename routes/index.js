import userController from '../controllers/userController'
import transactionController from '../controllers/transactionController'
import chatController from '../controllers/chatController'
const users = new userController();
const transactions = new transactionController();
const chat = new chatController()

import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import userMiddleware from '../middlewares/userMiddleware'
const authToken = new authTokenMiddleware();
const userProvider = new userMiddleware()


export default (app) =>{

    app.group('/api/v1/',(router) =>{
        router
            .get('/', users.getUser)
            .post('/register',users.register)
            .post('/login',users.login,users.updateToken)
            .post('/transactions/getTransaction',authToken.checkAuthToken,transactions.getTransaction)
            .post('/transactions/getEthTransaction',authToken.checkAuthToken,transactions.getEthTransaction)
            .post('/transactions/getTokenTransaction',authToken.checkAuthToken,transactions.getTokenTransaction)
            .post('/chat/search-user',authToken.checkAuthToken,chat.searchUserForRoom)            
            .post('/chat/insert',authToken.checkAuthToken,userProvider.checkUserName,chat.insertMessage)
    })

    app.use('*',(req,res,next) =>{
        res.status(404).json({
            status: 0,
            message: 'api call undefined'
        })
    })


};