import db from '../config/db';
import moment from 'moment';
const Schema = db.Schema;

const postSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'fakeUser' },
    title: {type: String, required: true},
    body: {type: String},
    basePostId:{type:String,default: 0},
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') }
  });


export default {
    postSchema: postSchema
}