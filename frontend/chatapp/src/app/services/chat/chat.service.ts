// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable({
//   providedIn: 'root',
// })
// export class ChatService {
//   private userUUID: string; // User's UUID

//   constructor(private socket: Socket) {
//     this.userUUID = uuidv4(); // Generate a UUID for the user
//   }

//   joinRoom(room: string) {
//     this.socket.emit('join', { room, userUUID: this.userUUID });
//   }

//   sendMessage(room: string, message: string) {
//     this.socket.emit('message', { room, userUUID: this.userUUID, message });
//   }

//   initiateVideoCall(room: string, targetUserUUID: string) {
//     this.socket.emit('initiate-video-call', { room, userUUID: this.userUUID, targetUserUUID });
//   }

//   onNewMessage() {
//     return this.socket.fromEvent('new message');
//   }

//   onUserJoined() {
//     return this.socket.fromEvent('user joined');
//   }

//   onVideoCallRequest() {
//     return this.socket.fromEvent('video call request');
//   }
// }

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {

}

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
  sendImage(room: string, user: string, image: string, isImage: boolean) {
    // Assuming you have a socket event for sending images, emit it with the image data.
    console.log({ room, user, image, isImage })
    this.socket.emit('image', { room, user, image, isImage });
  }
  
  // Implement methods to handle image messages received from the server
  onImageReceived() {
    return this.socket.fromEvent('receive image');
  }
}