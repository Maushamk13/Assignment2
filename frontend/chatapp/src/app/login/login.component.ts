import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Check the error status code to determine the error type
          if (error.status === 500) {
            alert('Incorrect Email or Password, please try again!');
          } else {
            this.errorMessage = "An error occurred while processing your request. Please try again later.";
          }
          // Return an empty observable to prevent the error from being logged
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response && response.status) {
          const user = response.user;
  
          // Store user data in local storage
          localStorage.setItem('userId', user._id);
          localStorage.setItem('email', user.email);
  
          // Redirect to the chat page
          this.router.navigateByUrl(`/chat/${user._id}`);
        } else {
          alert("Email or Password incorrect, please try again!")
        }
      });
  }
}
