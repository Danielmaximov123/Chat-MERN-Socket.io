module.exports = (io) => {
    let activeUsers = [];
  
    try {
      io.on('connection' , (socket) => {
        // add new User 
        socket.on('new-user-add' , newUserId => {
            try {
                if(!activeUsers.some(user => user.userId === newUserId)) {
                    activeUsers.push({
                        userId : newUserId,
                        socketId : socket.id
                    })
                }
    
                io.emit('get-users' , activeUsers)
            } catch (error) {
                console.error(error)
            }
        })
    
        // Send Message 
        socket.on('send-message' , data => {
            try {
                const {receiverId} = data
                const user = activeUsers.find(user => user.userId === receiverId)
                if(user) {
                    io.to(user.socketId).emit('receive-message' , data)
                    io.to(user.socketId).emit('notification' , data.dataNotification)
                }
            } catch (error) {
                console.error(error)
            }
        })
    
        // Update User
        socket.on('update-user-details' , updatedUser => {
            try {
                io.emit('user-updated' , updatedUser)
            } catch (error) {
                console.error(error)
            }
        })
    
        // New Chat
        socket.on('create-chat', chat => {
            try {
                io.emit('receive-chat', chat);
            } catch (error) {
                console.error(error)
            }
        })
    
        // User Logout
        socket.on('user-logout', (userId) => {
            try {
                activeUsers = activeUsers.filter((user) => user.userId !== userId);
                io.emit('get-users', activeUsers);
            } catch (error) {
                console.error(error)
            }
        });

        // User Typing
        socket.on('user-typing' , (data) => {
            try {
                io.emit('typing' , data)
            } catch (error) {
                console.error(error);
            }
        })
    
        socket.on('disconnect' , () => {
            try {
                activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
                io.emit('get-users' , activeUsers)
            } catch (error) {
                console.error(error)
            }
        })
    })
    } catch (error) {
        console.log(error);
    }
  };
  