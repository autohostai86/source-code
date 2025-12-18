/** @format */

import { DEVELOPMENT, PRODUCTION, USER_ROOM_KEY } from '@app/constants';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './logger';
import UserService from '@app/services/UserService';
import CustomerService from '@app/services/CustomerService';

// import socketIO from 'socket.io';

let io = undefined;
export default async ({ app }) => {
    const httpServer = createServer(app);
    if (global.process.env.NODE_ENV === DEVELOPMENT) {
        io = new Server(httpServer, { cors: { origin: '*' } });
    }

    if (global.process.env.NODE_ENV === PRODUCTION) {
        io = new Server(httpServer, { cors: { origin: '*' } });
    }

    io.on('connection', (socket) => {
        logger.info('New client connected');

        // joining on specifc room for notification
        socket.on('notificationRoom', ({userId}) => {
            socket.join(userId);
            logger.info(`${userId} is joined to room: ${userId}`);
        });

        // sending notification
        socket.on('notifyUser', ({userId}) => {
            io.to(userId).emit('newOfflineMessage')
            logger.info(`sending notification msg to room: ${userId}`);
        });

        // create a room 
        socket.on('liveRoom', ({botId, aptNo, phoneNumber, userName}) => {
            const room = `${botId}_${aptNo}_${phoneNumber}`;
            socket.join(room);
            if (userName !== '') {
                const roomName = `${botId}_${aptNo}_${phoneNumber}`;
                const message = {
                    content: `${userName ? userName : 'A customer service agent'} is joined to the session, please ask your questions`,
                    isUser: false,
                    timestamp: new Date().toISOString(),
                    type: 'type'
                }
                // console.log(message);
                io.to(roomName).emit('joined', message);
                logger.info(`${userName} is joined to room: ${room}`);
            } else {
                logger.info(`User is joined to room: ${room}`);
            }
        });

        // broadcasting message to specific room
        socket.on('liveRoomMessage', ({ roomName, message, userId, to, agent }) => {
            const emit = io.to(roomName).emit('message', message);
            logger.info(`event is ${emit}`);

            if (userId) {
                if (!agent) {
                    UserService.sendNotificationOfMessage({userId: userId, message: message.content});
                }
            }
            
            if (to && to !== '') {
                const arr = roomName.split('_');
                const postData = {
                    botId: arr?.[0],
                    aptNo: arr?.[1],
                    customerId: to,
                    message: message
                }
                
                UserService.saveSingleMessage(postData);
            }
        });

        socket.on('disconnect', () => {
            logger.info('Client disconnected');
        });

        // handling the user active status
        socket.on('userOnline', ({ userId }) => {
            UserService.updateUserOnlineStatus({_id: userId, status: true});
        });

        // handling the user active status
        socket.on('userOffline', ({ userId }) => {
            console.log(userId);
            UserService.updateUserOnlineStatus({_id: userId, status: false});
        });


        // handling the customer active status
        socket.on('customerOnline', ({ userId }) => {
            CustomerService.updateUserOnlineStatus({_id: userId, status: true});
        });

        // handling the customer active status
        socket.on('customerOffline', ({ userId }) => {
            console.log(userId);
            CustomerService.updateUserOnlineStatus({_id: userId, status: false});
        });
    });

    return httpServer;
};

export { io };
