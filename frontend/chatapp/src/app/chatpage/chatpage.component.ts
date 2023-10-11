import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../services/chat/chat.service';
import Peer from 'peerjs';
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
  remoteVideos: MediaStream[] = []; // Track remote users' video streams
  myPeer: Peer | null = null;
  myVideoStream: MediaStream = new MediaStream();

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

          this.socketServices.onNewMessage().subscribe((data: any) => {
            this.messages.push(data);
          });

          this.myPeer = new Peer(this.userId, {
            host: '/',
            port: 3001,
          });

          this.myPeer.on('open', (userId) => {
            this.socket.emit('join-room', userId, this.group); // Join the room (group)
          });

          navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: true,
            })
            .then((stream) => {
              this.myVideoStream = stream;
              this.addMyVideo(stream);

              this.myPeer?.on('call', (call) => {
                if (this.myPeer && this.group === this.user.group) { // Check if users have the same group
                  call.answer(stream);
                  call.on('stream', (otherUserVideoStream) => {
                    this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
                  });
                }
              });

              this.socket.on('user-connected', (userId: string) => {
                if (this.group === this.user.group) {
                  setTimeout(() => {
                    const call = this.myPeer!.call(userId, this.myVideoStream, {
                      metadata: { userId: this.userId, group: this.group },
                    });
        
                    call.on('stream', (otherUserVideoStream) => {
                      this.addOtherUserVideo(userId, otherUserVideoStream);
                    });
        
                    call.on('close', () => {
                      this.videos = this.videos.filter((video) => video.userId !== userId);
                      this.remoteVideos = this.remoteVideos.filter((video) => video.id !== userId);
                    });
                  }, 1000);
                }
              });
        
              this.socket.on('user-disconnected', (userId: string) => {
                this.videos = this.videos.filter((video) => video.userId !== userId);
                this.remoteVideos = this.remoteVideos.filter((video) => video.id !== userId);
              });
            })
            .catch((err) => {
              console.log('Error accessing media devices:', err);
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
    this.remoteVideos.push(stream);
    // You can handle displaying remote video elements here if needed

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
  joinVideoCall() {
    const remoteUserId = prompt('Enter the user ID you want to call:');
    if (remoteUserId) {
      const call = this.myPeer!.call(remoteUserId, this.myVideoStream, {
        metadata: { userId: this.userId, group: this.group },
      });

      call.on('stream', (otherUserVideoStream) => {
        this.addOtherUserVideo(remoteUserId, otherUserVideoStream);
      });

      call.on('close', () => {
        this.remoteVideos = this.remoteVideos.filter((video) => video.id !== remoteUserId);
      });
    }
  }

}

