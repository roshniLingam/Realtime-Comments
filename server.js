//create server using express
const { response } = require('express');
const express= require('express');
const app= express();

const port= process.env.PORT || 3000;

//use static files
app.use(express.static('public'));
const server= app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});

// db connection
const dbConnect= require('./db');
dbConnect();

const Comments= require('./models/comment');

app.use(express.json()); //the data will be in json format
//routes
app.post('/api/comments', (req, res)=>{
    const comment= new Comments({
        username: req.body.username,
        comment: req.body.comment
    })
    //save the comment to the database
    comment.save().then(response=>{
        res.send(response)
    })
})

app.get('/api/comments', (req, res)=>{
    Comments.find().then( function(comments){
        res.send(comments)
    })
})


let io= require('socket.io')(server);

io.on('connection', (socket)=>{
    console.log('Made a connection', socket.id);
    socket.on('comment', (data)=>{
        //add time to the data
        data.time= Date()
        socket.broadcast.emit('comment', data) //broadcast to all the clients except the one who sent the data
        
    })

    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing', data)
    })
})