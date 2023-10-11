import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit {
  userId: string = "";
  user: any;
  firstname: string = ""; // Variable to store user information

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Get the user._id from the URL
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];

      // Fetch all user information from your new API
      this.http.get(`http://localhost:3000/user/all`)
        .subscribe((response: any) => {
          if (response && response.status) {
            // Filter the user based on the userId
            this.user = response.users.find((user: { _id: string; }) => user._id === this.userId);
            console.log(this.user);
            this.firstname = this.user.firstname;
    }});
    });
  }
}