import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit {
  userId: string = "";
  firstname: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Retrieve the user's first name from local storage
    const storedFirstname = localStorage.getItem('firstname');
    if (storedFirstname !== null) {
      this.firstname = storedFirstname;
    } else {
      // Handle the case where 'firstname' is null or not found
    }
  }
}