// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { ChatService } from '../services/chat/chat.service';

// @Component({
//   selector: 'app-chatpage',
//   templateUrl: './chatpage.component.html',
//   styleUrls: ['./chatpage.component.css'],
// })
// export class ChatpageComponent implements OnInit {
//   userId: string = "";
//   user: any;
//   firstname: string = "";
//   group: number[] = []; // Default group value
//   message: string = "";
//   messages: any[] = [];


//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private socketService: ChatService
//   ) {
    
//   }

//   ngOnInit() {
//     // Get the user._id and group from the URL
//     this.route.params.subscribe((params) => {
//       this.userId = params['userId'];

//       // Fetch user information from your new API
//       this.http.get(`http://localhost:3000/user/all`).subscribe((response: any) => {
//         if (response && response.status) {
//           // Filter the user based on the userId
//           this.user = response.users.find((user: { _id: string }) => user._id === this.userId);
//           this.firstname = this.user.firstname;
//           this.group = this.user.group
//           // Join the chat room with the group value
//           this.socketService.joinRoom(`group_${this.group}`, this.firstname);

//           // Listen for new messages
//           this.socketService.onNewMessage().subscribe((data: any) => {
//             this.messages.push(data);
//           });
//         }
//       });
//     });
//   }

//   // Method to send a message
//   sendMessage() {
//     if (this.message) {
//       this.socketService.sendMessage(`group_${this.group}`, this.firstname, this.message);
//       this.message = ""; // Clear the input field
//     }
//   }
  

// }


// chatpage.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import {ChatService} from '../services/chat/chat.service';
import Peer from 'peerjs'; // Import Peer
import { v4 as uuidv4 } from 'uuid';

interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css'],
})
export class ChatpageComponent implements OnInit {
  userId: string = "";
  user: any;
  firstname: string = "";
  group: number[] = [];
  message: string = "";
  messages: any[] = [];
  videoCallId: string = "";
  videos: VideoElement[] = [];
  myPeer: Peer | null = null;
  myVideoStream: MediaStream | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socket: Socket,
    private socketServices: ChatService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];

      this.http.get(`http://localhost:3000/user/all`).subscribe((response: any) => {
        if (response && response.status) {
          this.user = response.users.find((user: { _id: string }) => user._id === this.userId);
          this.firstname = this.user.firstname;
          this.group = this.user.group;
          this.socketServices.joinRoom(`group_${this.group}`, this.firstname);

           // Listen for new messages
          this.socketServices.onNewMessage().subscribe((data: any) => {
          this.messages.push(data);
           });
          // Initialize the Peer server
          this.myPeer = new Peer(this.userId, {
            host: '/',
            port: 3001,
          });

          this.myPeer.on('open', (userId) => {
            // Emit an event to inform the server that the user is ready
            this.socket.emit('join-room', userId, userId);
          });

          // Request user's media stream (video and audio)
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: true,
            })
            .then((stream) => {
              this.myVideoStream = stream;

              // Add the user's video to the UI
              this.addMyVideo(stream);

              // Answer incoming video calls
              if (this.myPeer) {
                this.myPeer.on('call', (call) => {
                  call.answer(stream);
                  call.on('stream', (otherUserVideoStream) => {
                    this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
                  });
                });
              }

              // Notify other users that you've joined
              this.socket.on('user-connected', (userId: string) => {
                // Simulate waiting for a bit before calling
                setTimeout(() => {
                  const call = this.myPeer!.call(userId, stream, {
                    metadata: { userId: this.userId },
                  });

                  call.on('stream', (otherUserVideoStream) => {
                    this.addOtherUserVideo(userId, otherUserVideoStream);
                  });

                  call.on('close', () => {
                    this.videos = this.videos.filter((video) => video.userId !== userId);
                  });
                }, 1000);
              });

              // Handle user disconnection
              this.socket.on('user-disconnected', (userId: string) => {
                this.videos = this.videos.filter((video) => video.userId !== userId);
              });
            })
            .catch((err) => {
              console.log('Error accessing media devices:', err);
            });

          // Handle video call initiation
          this.startVideoCall();

          this.socket.on('user-disconnected', (userId: string) => {
            console.log(`User disconnected: ${userId}`);
            this.videos = this.videos.filter((video) => video.userId !== userId);
          });

          // Handle video call initiation
          this.socket.on('video-call-request', (data: any) => {
            console.log('Received video call request with ID:', data.videoCallId);
            // Handle the incoming video call request, for example, displaying a notification to the user.
          });
        }
      });
    });
  }

  addMyVideo(stream: MediaStream) {
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.userId,
    });
  }

  addOtherUserVideo(userId: string, stream: MediaStream) {
    this.videos.push({
      muted: false,
      srcObject: stream,
      userId,
    });
  }

  onloadedmetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }

  sendMessage() {
    if (this.message) {
      this.socketServices.sendMessage(`group_${this.group}`, this.firstname, this.message);
      this.message = "";
    }
  }

  // Method to start a video call
  startVideoCall() {
    if (this.videoCallId) {
      // You can implement your logic for initiating a video call here
      // For example:
      this.socket.emit('initiate-video-call', { videoCallId: this.videoCallId });
    }
  }
}



