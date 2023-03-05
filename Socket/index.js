require('dotenv').config()

const io = require('socket.io')(8800 || process.env.PORT , {
    cors : {
        origin : ['http://localhost:3000' , 'http://localhost:3001']
    }
})

let activeUsers = []

io.on('connection' , (socket) => {
    // add new User 
    socket.on('new-user-add' , newUserId => {
        if(!activeUsers.some(user => user.userId === newUserId)) {
            activeUsers.push({
                userId : newUserId,
                socketId : socket.id
            })
        }
        
        io.emit('get-users' , activeUsers)
    })

    // Send Message 
    socket.on('send-message' , data => {
        const {receiverId} = data
        const user = activeUsers.find(user => user.userId === receiverId)
        if(user) {
            io.to(user.socketId).emit('receive-message' , data)
        }
    })

    // Update User
    socket.on('update-user-details' , updatedUser => {
        io.emit('user-updated' , updatedUser)
    })

    // New Chat
    socket.on('create-chat', chat => {
        io.emit('receive-chat', chat);
      })

    // User Logout
    socket.on('user-logout', (userId) => {
      activeUsers = activeUsers.filter((user) => user.userId !== userId);
      io.emit('get-users', activeUsers);
    });

    socket.on('disconnect' , () => {
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
        io.emit('get-users' , activeUsers)
    })
})