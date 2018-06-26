import  model from '../models/user_model'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_'
const data 	= {};
const tomodel = {};
const user_model = new model();


export default class authTokenMiddleware{

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
            user_model.getUserHashAddressByToken(tomodel,(err1,doc) =>{
    
                if(err1){
                  return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
                }else if(doc==null){
                  return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
                }
    
                req.headers['user_id'] = doc._id
                req.headers['user_address'] = doc.user_address
                req.headers['eth_address'] = doc.eth_address
                req.headers['eth_private_key'] = doc.eth_private_key
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