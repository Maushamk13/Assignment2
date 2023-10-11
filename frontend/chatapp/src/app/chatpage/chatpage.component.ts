import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../services/chat/chat.service'

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css'],
})
export class ChatpageComponent implements OnInit {
  userId: string = "";
  user: any;
  firstname: string = "";
  group: number[] = []; // Default group value
  message: string = "";
  messages: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socketService: ChatService
  ) {}

  ngOnInit() {
    // Get the user._id and group from the URL
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];

      // Fetch user information from your new API
      this.http.get(`http://localhost:3000/user/all`).subscribe((response: any) => {
        if (response && response.status) {
          // Filter the user based on the userId
          this.user = response.users.find((user: { _id: string }) => user._id === this.userId);
          this.firstname = this.user.firstname;
          this.group = this.user.group
          // Join the chat room with the group value
          this.socketService.joinRoom(`group_${this.group}`, this.firstname);

          // Listen for new messages
          this.socketService.onNewMessage().subscribe((data: any) => {
            this.messages.push(data);
          });
        }
      });
    });
  }

  // Method to send a message
  sendMessage() {
    if (this.message) {
      this.socketService.sendMessage(`group_${this.group}`, this.firstname, this.message);
      this.message = ""; // Clear the input field
    }
  }
}
