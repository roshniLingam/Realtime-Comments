function dbConnect(){
    //DB connection
    const mongoose= require('mongoose');
    const url='USE_YOUR_DB_URI'

    mongoose.connect( url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const connection= mongoose.connection;
    connection.once('open', function(){
        console.log('MongoDB database connection established successfully');
    }).on('error', function(err){
        console.log('Error is: ', err);
    })
}

module.exports= dbConnect;