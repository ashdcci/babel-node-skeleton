import crypto from 'crypto';
import bitcoin from 'bitcoinjs-lib';
import bigi from 'bigi';
import buffer from 'buffer'
import transaction_model from '../models/transaction_model';
import user_model from '../models/user_model';
const userModel = new user_model();
const transactionModel = new transaction_model();
const data = {};
const tomodel = {};


export default class TransactionController{
    getTransaction = (req, res, next) =>{

        if(!req.headers['user_id']){
            return res.status(400).json({
              status: 0,
              message: 'user details not found'
            })
        }
        tomodel._id = req.headers['user_id']
        tomodel.user_address = req.headers['user_address']
        tomodel.tx_type = (req.body.tx_type!==undefined) ? req.body.tx_type : 0
        
        transactionModel.getBitcoinTransactions(tomodel,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message: 'problam in fetch data'
                })
            }

            return res.status(200).json({
                status: 1,
                message:'Tranasactions fetch',
                data: rows
            })

        })
    }   

    getEthTransaction = (req, res, next) =>{
        if(!req.headers['user_id']){
            return res.status(400).json({
              status: 0,
              message: 'user details not found'
            })
          }
          tomodel._id = req.headers['user_id']
          tomodel.eth_address = req.headers['eth_address']
          tomodel.tx_type = (req.body.tx_type!==undefined) ? parseInt(req.body.tx_type) : 0
        
        transactionModel.getEthTransactions(tomodel,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message: 'problam in fetch data'
                })
            }

            return res.status(200).json({
                status: 1,
                message:'Tranasactions fetch',
                data: rows
            })

        })
    }

    getTokenTransaction = (req, res, next) =>{
        if(!req.headers['user_id']){
            return res.status(400).json({
              status: 0,
              message: 'user details not found'
            })
        }
        tomodel._id = req.headers['user_id']
        tomodel.user_address = req.headers['user_address']
        tomodel.tx_type = (req.body.tx_type!==undefined) ? req.body.tx_type : 0
        
        transactionModel.getEthTransactions(req.body,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message: 'problam in fetch data'
                })
            }

            return res.status(200).json({
                status: 1,
                message:'Tranasactions fetch',
                data: rows
            })

        })
    }
}