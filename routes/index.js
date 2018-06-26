import userController from '../controllers/userController'
import transactionController from '../controllers/transactionController'
const users = new userController();
const transactions = new transactionController();

import authTokenMiddleware from '../middlewares/authTokenMiddleware';
const authToken = new authTokenMiddleware();



export default (app) =>{

    app.group('/api/v1/',(router) =>{
        router.get('/', users.getUser)
        router.post('/register',users.register)
        router.post('/login',users.login,users.updateToken)
        router.post('/transactions/getTransaction',authToken.checkAuthToken,transactions.getTransaction)
        router.post('/transactions/getEthTransaction',authToken.checkAuthToken,transactions.getEthTransaction)
        router.post('/transactions/getTokenTransaction',authToken.checkAuthToken,transactions.getTokenTransaction)
        
    })

    app.use('*',(req,res,next) =>{
        res.status(404).json({
            status: 0,
            message: 'api call undefined'
        })
    })


};