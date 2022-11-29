import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { IUser } from 'src/app/models/common/user';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: ['', Validators.required],  
    password: ['', Validators.required]  
  });  

  message!: string;  
  returnUrl!: string; 

  constructor(
    private formBuilder : FormBuilder,  
    private router : Router,  
    private authService : AuthService ,
    private authGuard:AuthGuard
    ) { }

  ngOnInit(): void {
    if(this.authGuard.isLoggedIn())
    {
      this.router.navigate(["/"]);  
    }
  }

  login() {  
    if (this.loginForm.invalid) {  
      return;  
    }  
    else {  
      this.authService.login(this.loginForm.get("username")?.getRawValue()
                              ,this.loginForm.get("password")?.getRawValue())
      .subscribe((res) =>{
        if(res.success){
          console.log("Login successful");  
          sessionStorage.setItem('isLoggedIn', "true");  

          const session = res.session;
          sessionStorage.setItem('token', session.access_token ?? "");  
          this.router.navigate(["/"]);  
        }
        else {  
          this.message = "Please check your username and password";  
        }  
      });
    }  
  }
}
