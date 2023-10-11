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
  selectedGroups: number[] = [];
  groupNumbers: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Generate numbers from 1 to 10
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
      "group": this.selectedGroups,
    };
    this.http.post("http://localhost:3000/user/create",bodyData).subscribe((resultData: any)=>
    {
      console.log(resultData);
      alert("User Registered Successfully")
      console.log(bodyData);
    });
  }
  save()
  {
    this.register();
  }
}
