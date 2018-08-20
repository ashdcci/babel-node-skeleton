import db from '../config/db';
import moment from 'moment';
const Schema = db.Schema;

const followerSchema = new Schema({
    user_id:   { type: String,required: true, index: { unique: true }},
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    timeline: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });


export default {
    followerSchema: followerSchema
}