import db from '../config/db'
import moment from 'moment'
const Schema = db.Schema;

const MessageSchema = new Schema({
    from: String,
    to: String,
    body: String,
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
    is_deleted: { type: Array, default:[]}
  });


const chatSchema = new Schema({
    receipent:  [String],
    message: {
      type: [MessageSchema],
      default: undefined    
    },
    is_deleted: { type: Array, default:[]},
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
  });
  
  
  export default {
    chatSchema: chatSchema
  }

