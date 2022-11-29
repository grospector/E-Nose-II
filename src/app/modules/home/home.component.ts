import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/api/services/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { IUser } from 'src/app/models/common/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  CurrentUser!:IUser;

  constructor(private router: Router
              ,private authService:AuthService
              ,private userService:UserService) { }

  ngOnInit(): void {
    this.CurrentUser = this.userService.GetSessionUser();
    console.log(this.CurrentUser);
  }

  onClickLogout(): void{
    this.authService.logout();
  }

  onClickMobule(module:string): void{
    this.router.navigateByUrl('/'+module);
  }
}
