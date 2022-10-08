//client side code
let username
let socket= io()
do{
    username = prompt("Enter your username")
}while(!username)

const textarea = document.querySelector('#textarea')
const submitBtn = document.querySelector('#submitBtn')
const commentBox= document.querySelector('.comment__box')

submitBtn.addEventListener('click', (event)=>{
    event.preventDefault()

    let comment= textarea.value;
    //if nothing is added in the comment
    if(!comment){
        return;
    }
    //if something is added in the comment
    postComment(comment)
})

function postComment(comment){
    //append to dom
    let data={
        username: username,
        comment: comment,

    }
    appendToDom(data)
    textarea.value= ''
    //broadcast
    broadcastComment(data)
    //Sync with MongoDB
    syncWithDB(data);
}

function appendToDom(data){
    let lTag= document.createElement('li')
    lTag.classList.add('comment', 'mb-3')
    let markup= `
    <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment}</p>
            <div>
                <img src="/img/clockIcon.png" alt="Clock">
                <small> ${moment(data.time).format('LT')} </small>
            </div>
        </div>
    </div>
    `
    lTag.innerHTML= markup
    commentBox.prepend(lTag)
}

function broadcastComment(data){
    //socket- event
    socket.emit('comment', data)

}

//receive the data in the client side
socket.on('comment', (data)=>{
    appendToDom(data)
})

let timerId=null;
function debounce(func, timer){
    if(timerId){
        clearTimeout(timerId) //when cleared, setTimeout will not be called
    }
    timerId= setTimeout(()=>{
        func()
    }, timer)
}

//receive the socket
socket.on('typing', (data)=>{
    let typingDiv= document.querySelector('.typing')
    typingDiv.innerHTML= `${data.username} is typing...`
    //when user is not typing, stop showing 'is typing...' message
    debounce( function(){
        typingDiv.innerHTML= ''
    }, 1000)
})

//event listener when one user is typing
textarea.addEventListener('keyup', ()=>{
    socket.emit('typing', {username}) //typing event is emitted
})

function syncWithDB(data){
    const headers={
        'Content-Type': 'application/json'
    }

    fetch('/api/comments', {method: 'Post', body: JSON.stringify(data), headers})
    .then(response=> response.json())
    .then(result=>{
        console.log(result)
    })
}

//fetch all previous comments
function fetchComments(){
    //default is GET method
    fetch('/api/comments')
    .then(res=> res.json())
    .then(result=>{
        //result is an array
        result.forEach((comment)=>{
            comment.time= comment.createdAt
            appendToDom(comment)
        })
    })
}

window.onload= fetchComments