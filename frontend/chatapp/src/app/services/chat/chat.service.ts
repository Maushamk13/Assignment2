import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  joinRoom(room: string, user: string) {
    this.socket.emit('join', { room, user });
  }

  sendMessage(room: string, user: string, message: string) {
    this.socket.emit('message', { room, user, message });
  }

  onNewMessage() {
    return this.socket.fromEvent('new message');
  }

  onUserJoined() {
    return this.socket.fromEvent('user joined');
  }
}

