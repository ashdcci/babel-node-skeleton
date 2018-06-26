import db from '../config/db'
import crypto from 'crypto';
import moment from 'moment';
import userSchema from '../schemas/userSchema';
import transactionSchema from '../schemas/transactionSchema'
const User = db.model('User', userSchema.userSchema)
const pwd = ''
const tomodel = {}
var Transaction = db.model('Transaction', transactionSchema.transactionSchema)

export default class TransactionModel{
    getBitcoinTransactions = (data, callback) =>{
        Transaction.aggregate([
            {
              $match: {
                "$or": [{
                    "sender_address": data.user_address
                  },
                  {
                    "recr_address": data.user_address
                  }
                ],
                $and:[{
                  "tx_type":data.tx_type
                }]
              }
            },
            {
              $lookup: {
                "from": "users",
                "localField": "sender_address",
                "foreignField": "user_address",
                "as": "user"
              }
            },
            {
              $lookup: {
                "from": "users",
                "localField": "recr_address",
                "foreignField": "user_address",
                "as": "user_receive"
              }
            },
            {
              $unwind: {
                'path': '$user',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                'path': '$user_receive',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 1,
                "amount": "$amount",
                "tx_hash":"$transaction_hash",
                "payment_dated": {
                  $dateToString: {
                    format: '%Y-%m-%d %H:%m',
                    date: {$ifNull: ["$created_at", new Date("1970-01-01T00:00:00.000Z")]}
                  }
                },
                "type": {
                  "$switch": {
                    "branches": [{
                        "case": {
                          $eq: ["$sender_address", data.user_address]
                        },
                        then: "1"
                      },
                      {
                        "case": {
                          $eq: ["$recr_address", data.user_address]
                        },
                        then: "2"
                      }
                    ],
                    "default": "0"
                  }
                },
                "user_id": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.user_address]
                    },
                    then: "$user_receive._id",
                    else: "$user._id"
                  }
                },
                "first_name": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.user_address]
                    },
                    then: "$user_receive.first_name",
                    else: "$user.first_name"
                  }
                },
                "last_name": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.user_address]
                    },
                    then: "$user_receive.last_name",
                    else: "$user.last_name"
                  }
                },
                "address": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.user_address]
                    },
                    then: "$user_receive.user_address",
                    else: "$user.user_address"
                  }
                }
              }
            },{
              $sort:{
                "virtual_sender": -1
              }
            }    
          ]).exec().then((tx) =>{
            if(tx==null){
              throw ({
                err_obj: 2
              })
            }
            callback(null, tx)
      
          }).catch((err) =>{
            if (err.err_obj) {
              callback(null, null)
            } else {
              callback(err, null)
            }
          })
    }

    getEthTransactions = (data, callback) =>{
        console.log(data)
        Transaction.aggregate([
            {
              $match: {
                "$or": [{
                    "sender_address": data.eth_address
                  },
                  {
                    "recr_address": data.eth_address
                  }
                ],
                $and:[{
                  "tx_type":data.tx_type
                }]
              }
            },
            {
              $lookup: {
                "from": "users",
                "localField": "sender_address",
                "foreignField": "eth_address",
                "as": "user"
              }
            },
            {
              $lookup: {
                "from": "users",
                "localField": "recr_address",
                "foreignField": "eth_address",
                "as": "user_receive"
              }
            },
            {
              $unwind: {
                'path': '$user',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                'path': '$user_receive',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 1,
                "amount": "$amount",
                "tx_hash":"$transaction_hash",
                "payment_dated": {
                  $dateToString: {
                    format: '%Y-%m-%d %H:%m',
                    date: {$ifNull: ["$created_at", new Date("1970-01-01T00:00:00.000Z")]}
                  }
                },
                "type": {
                  "$switch": {
                    "branches": [{
                        "case": {
                          $eq: ["$sender_address", data.eth_address]
                        },
                        then: "1"
                      },
                      {
                        "case": {
                          $eq: ["$recr_address", data.eth_address]
                        },
                        then: "2"
                      }
                    ],
                    "default": "0"
                  }
                },
                "user_id": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.eth_address]
                    },
                    then: "$user_receive._id",
                    else: "$user._id"
                  }
                },
                "first_name": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.eth_address]
                    },
                    then: "$user_receive.first_name",
                    else: "$user.first_name"
                  }
                },
                "last_name": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.eth_address]
                    },
                    then: "$user_receive.last_name",
                    else: "$user.last_name"
                  }
                },
                "address": {
                  $cond: {
                    if: {
                      $eq: ["$sender_address", data.eth_address]
                    },
                    then: "$user_receive.eth_address",
                    else: "$user.eth_address"
                  }
                }
              }
            },{
              $sort:{
                "virtual_sender": -1
              }
            }    
          ]).exec().then((tx) =>{
            if(tx==null){
              throw ({
                err_obj: 2
              })
            }
            callback(null, tx)
        
          }).catch((err) =>{
            if (err.err_obj) {
              callback(null, null)
            } else {
              callback(err, null)
            }
          })
    }


}