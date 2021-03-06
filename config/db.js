import mongoose from 'mongoose'
const options = {
    // useNewUrlParser: true,
    autoIndex: true, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 50, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
mongoose.connect(process.env.BNP_DB_URI,options)
.then(() => {
    mongoose.Promise = global.Promise
    console.log('db connected:')
})
.catch(err => { // mongoose connection error will be handled here
    console.error('App starting error:', err.message);
    // process.exit(1);
    return false
});


export default mongoose
