module.exports = (io) => {
    let activeUsers = [];
  
    try {
        io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected.`);
        
            socket.on('new-user-add', (newUserId) => {
              if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({
                  userId: newUserId,
                  socketId: socket.id,
                });
              }
        
              io.emit('get-users', activeUsers);
            });
        
            socket.on('send-message', (data) => {
              const { receiverId } = data;
              const user = activeUsers.find((user) => user.userId === receiverId);
              if (user) {
                io.to(user.socketId).emit('receive-message', data);
              //   io.to(user.socketId).emit('notification', {
              //     senderId: data.senderId,
              //     isRead: false,
              //     date: data.createdAt,
              //   });
              }
            });
        
            socket.on('update-user-details', (updatedUser) => {
              io.emit('user-updated', updatedUser);
            });
        
            socket.on('create-chat', (chat) => {
              io.emit('receive-chat', chat);
            });
        
            socket.on('user-logout', (userId) => {
              activeUsers = activeUsers.filter((user) => user.userId !== userId);
              io.emit('get-users', activeUsers);
            });
        
            socket.on('disconnect', () => {
              activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
              io.emit('get-users', activeUsers);
            });
          });
    } catch (error) {
        console.log(error);
    }
  };
  