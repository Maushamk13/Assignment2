import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../services/chat/chat.service';
import Peer from 'peerjs';

// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  remoteVideos: MediaStream[] = []; // Track remote users' video streams
  myPeer: Peer | null = null;
  myVideoStream: MediaStream = new MediaStream();
  isVideoCallActive: boolean = false;
  selectedImage: File | null = null;  // To store the selected image file
  selectedImageUrl: string | null = null;  // To store the URL of the selected image for display
  users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socket: Socket,
    private socketServices: ChatService,
    // private modalService: NgbModal,
  ) {}

  // public open(modal: any): void {
  //   this.modalService.open(modal);
  // }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];

      this.http.get(`http://localhost:3000/user/all`).subscribe((response: any) => {
        if (response && response.status) {
          this.user = response.users.find((user: { _id: string }) => user._id === this.userId);
          this.firstname = this.user.firstname;
          this.users = response.users.filter((user: { group: any[] }) => {
            return user.group.some(group => this.user.group.includes(group));
          });
          
          this.group = this.user.group;
          this.socketServices.joinRoom(`group_${this.group}`, this.firstname);
          this.socketServices.onImageReceived().subscribe((data: any) => {
            console.log("dataa", data);
            this.messages.push(data);  // Set the received image data 
          });
          
          this.socketServices.onNewMessage().subscribe((data: any) => {
            console.log(data);
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
                      this.remoteVideos = this.remoteVideos.filter((video) => video.id !== userId);
                    });
                  }, 1000);
                }
              });
        
              this.socket.on('user-disconnected', (userId: string) => {
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

  addOtherUserVideo(userId: string, stream: MediaStream) {
    this.remoteVideos.push(stream);
    // You can handle displaying remote video elements here if needed

  }

  onloadedmetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }

  sendMessage() {
    if (this.message) {
      console.log("messages: ", this.users);
      this.socketServices.sendMessage(`group_${this.group}`, this.firstname, this.message, this.userId);
      this.message = "";
    }
  }

  sendImage() {
    if (this.selectedImageUrl){
      
    this.socketServices.sendImage(`group_${this.group}`, this.firstname, this.selectedImageUrl, true, this.userId);
    console.log(this.selectedImage);
    this.clearSelectedImage();
    }
  }
  clearSelectedImage() {
    this.selectedImage = null;
    this.selectedImageUrl = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      this.selectedImage = file;  // Store the selected image
      this.selectedImageUrl = URL.createObjectURL(file); // Create a URL for the image to display
      // Assuming you have a function to send the image using your chat service, you can call it here.
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

