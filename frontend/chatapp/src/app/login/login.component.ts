import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const bodyData = {
      email: this.email,
      password: this.password,
    };
  
    this.http.post("http://localhost:3000/user/login", bodyData)
      .subscribe(
        (response: any) => {
          if (response.status) {
            const user = response.user;
  
            // Store user data in local storage
            localStorage.setItem('userId', user._id);
            localStorage.setItem('email', user.email);
  
            // Redirect to the chat page
            this.router.navigateByUrl(`/chat/${user._id}`);
          } else {
            alert("Email or Password incorrect, please try again!")
          }
        },
        (error) => {
          // Check the error status code to determine the error type
          if (error.status === 500) {
            this.errorMessage = "Internal Server Error. Please try again later.";
          } else {
            this.errorMessage = "An error occurred while processing your request. Please try again later.";
          }
        }
      );
  }
}
