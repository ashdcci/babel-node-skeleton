import amqp from 'amqplib/callback_api'
import async from 'async';
import moment from 'moment'
global.conn = {}
const channelQueueTopic = 'save_post_to_follower';
import post_model from '../models/post_model';
const postModel = new post_model()


export default class ampqClass{

    constructor(){
        this.ampq = amqp
        this.channelQueueTopic = channelQueueTopic;
        this.conn = conn
        // this.QueueConnector()
    }

    QueueConnector = async () =>{
        
        // try {
            
        //     await this.ampq.connect('amqp://localhost', function(err, connection) {
        //         console.log(545454)
        //         global.conn = connection
        //         // this.conn = global.conn
        //         console.log(global.conn.domain)
        //     });
        // }catch(err){
        //     console.log(err)
        // }
        
        
    }

    QueueSender = (userId,postId) =>{
        
        this.ampq.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
                var q = channelQueueTopic;
                var msg = {userId:userId, postId: postId};
                ch.assertQueue(q, {durable: true});
                ch.sendToQueue(q, new Buffer.from(JSON.stringify(msg)), {persistent: true});
                console.log(" [x] Sent '%s'", JSON.stringify(msg));

                ch.assertQueue(q, {durable: true});
                ch.prefetch(1);
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                ch.consume(q, function(msg) {
                    let obj = msg.content.toString('utf8');
                    
    
                    
                    console.log(" [x] Received %s",obj, JSON.parse(obj));

                    let tomodel = JSON.parse(obj)
                    console.log(" [x] start for "+tomodel.postId+" at: ",moment().format('YYYY-MM-DD HH:mm:ss'));
                    postModel.addPostToFollowersTimeLineModel(tomodel,(err,res)=>{
                        console.log('res::',res)
                        if(err){
                            console.log('err',err)
                        }else{
                            console.log(" [x] Done for "+tomodel.postId+" at: ",moment().format('YYYY-MM-DD HH:mm:ss'));
                        }
                    })
    
                }, {noAck: true});

            });
        });

    }

    QueueReceiver = ()=>{
        this.ampq.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
                var q = channelQueueTopic;

                ch.assertQueue(q, {durable: true});
                ch.prefetch(1);
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                ch.consume(q, function(msg) {
                let obj = msg.content.toString('utf8');
                

                
                console.log(" [x] Received %s",obj);

                tomodel = {}
                tomodel.latestPostId = postId
                tomodel.userId = userId

                postModel.addPostToFollowersTimeLineModel(tomodel,(err,res)=>{
                    console.log('res::',res)
                    if(err){
                        console.log('err')
                    }
                })


                setTimeout(function() {
                    console.log(" [x] Done");
                }, 4000);
                }, {noAck: true});
            });
        });
    }
}