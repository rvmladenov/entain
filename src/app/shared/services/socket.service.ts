import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '@shared/types/multiplayer';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private multiplayer = false;

  enableMultiplayer(): void {
    this.multiplayer = true;
    this.socket = io(environment.SOCKET_URL); // Connect to Socket.IO server
  }

  sendMessage(message: Message): void {
    if (this.multiplayer && this.socket) {
      this.socket.emit('message', message);
    }
  }

  createGame(message: Message): void {
    if (this.multiplayer && this.socket) {
      this.socket.emit('newGame', message);
    }
  }

  joinGame(message: Message): void {
    if (this.multiplayer && this.socket) {
      this.socket.emit('joinGame', message);
    }
  }

  onMessage(callback: (message: Message) => void): void {
    if (this.multiplayer && this.socket) {
      this.socket.on('message', callback);
    }
  }
}
