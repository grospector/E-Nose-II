import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { Role } from 'src/app/models/common/role';
import { IUser } from 'src/app/models/common/user';
import { EnumModules } from 'src/app/shared/footer-modules/footer-modules';
import { Customer, Representative } from './account-setting';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {
  users!: IUser[];
  customers!: Customer[];

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
  
  constructor(private http: HttpClient,
              private usersService:UsersService) {}

  ngOnInit(): void {
    this.getListUsers();
  }

  getGetUserRole(){
    const currentUser:IUser = AuthUtils.GetCurrentUser();
    return currentUser.role;
  }

  getListUsers(){
    var arg = this.usersService.GetListUsers();
    arg.subscribe(res =>{
      if(res.success)
      {
        this.loading = false;
        this.users = res.users;
      }
      else{
        this.loading = false;
      }
    });
  }

  onClickReset(userId:number){
    Swal.fire({
      title: 'Reset Password',
      text: 'Do you want to reset password',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reset',
      cancelButtonText: 'Cancel'
    }).then(
      (result) => {
        if(result.isConfirmed){
          this.resetPassword(userId);
        }
      }
    );
  }

  resetPassword(userId:number){
    var arg = this.usersService.ResetPassword(userId);
    arg.subscribe(res =>{
      if(res.success)
      {
        
      }
      else{
        this.loading = false;
      }
    });
  }

  onClickDelete(userId:number){
    
  }
}
