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
  //firstName: string = "";
  //lastName: string = "";
 // role: string = "";
 // group: number = 0;

  isLogin: boolean = true; 
  errorMessage: String = "";

  constructor(private router: Router, private http: HttpClient) {}
  login(){
    let bodyData = {
      email: this.email,
      password: this.password,
    };

      this.http.post("http://localhost:3000/user/login", bodyData).subscribe((resultData: any)=> {
      console.log(resultData);

      if (resultData.status)
      {
        this.router.navigateByUrl('/chat');
      }
      else 
      {
        alert("Incorrect Email or Password, please try again!");
      }

      });


  }



}
