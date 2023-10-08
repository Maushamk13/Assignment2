import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  firstname: string = "";
  lastname: string = "";
  email: string = "";
  password: string = "";
  role: string = "";
  group: number = 0; 

  constructor(private http: HttpClient)
  {
  }
  ngOnInIt(): void 
  {
  }

  register()
  {
    let bodyData = 
    {
      "firstname": this.firstname,
      "lastname": this.lastname,
      "email": this.email,
      "password": this.password,
      "role": this.role,
      "group": this.group,
    };
    this.http.post("http://localhost:3000/user/create",bodyData).subscribe((resultData: any)=>
    {
      console.log(resultData);
      alert("User Registered Successfully")
    });
  }
  save()
  {
    this.register();
  }
}
