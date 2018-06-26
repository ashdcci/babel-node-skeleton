import db from '../config/db';
import moment from 'moment';
const Schema = db.Schema;


const userSchema = new Schema({
  first_name:  String,
  last_name: String,
  email:   { type: String,required: true, index: { unique: true }},
  password: String,
  access_token: String,
  user_address:{type: String, default: null},
  address_private_key: {type: String, default: null},
  address_public_key: {type: String, default: null},
  address_wif: {type: String, default: null},
  created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
  updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
  deleted_at: { type: String, default: null },
  is_deleted: { type:Number, default:0},
  eth_address: {type: String, default: null},
  eth_private_key: {type: String, default: null},
  faucet: {type: String, default: 0},
});


export default {
  userSchema: userSchema
}
