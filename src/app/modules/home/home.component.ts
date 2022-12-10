import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDevice } from 'src/app/api/models/device.model';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { IUser } from 'src/app/models/common/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  CurrentUser!:IUser;
  CurrentDevice!:IDevice;

  displayModal!: boolean;

  constructor(private router: Router
              ,private authService:AuthService) { }

  ngOnInit(): void {
    this.CurrentUser = AuthUtils.GetSessionUser();
    this.CurrentDevice = AuthUtils.GetSessionDevice();
    console.log("CurrentUser",this.CurrentUser);
    console.log("CurrentDevice",this.CurrentDevice);
  }

  onClickSwitch(): void{
    if(!this.displayModal)
    {
      this.displayModal = true;
    }
  }
  
  onClickLogout(): void{
    this.authService.logout();
  }

  onClickMobule(module:string): void{
    this.router.navigateByUrl('/'+module);
  }
}
