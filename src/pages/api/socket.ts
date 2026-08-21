import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse & { socket: any }) {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      
      socket.on('join-order', (orderId) => {
        socket.join(`order-${orderId}`);
        console.log(`Socket ${socket.id} joined order-${orderId}`);
      });

      socket.on('join-staff', () => {
        socket.join('staff-room');
        console.log(`Socket ${socket.id} joined staff-room`);
      });

      socket.on('staff-update-order', (data) => {
        console.log('staff-update-order', data);
        io.to(`order-${data.orderId}`).emit('order-updated', data);
      });

      socket.on('disconnect', () => {

        console.log('User disconnected:', socket.id);
      });
    });
    
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}
