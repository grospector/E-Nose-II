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

  displayModalEditUser:boolean = false;
  editUserId:number = 0;
  inputName:string = "";
  inputUserName:string = "";
  inputCurrentPassword:string = "";
  inputPassword:string = "";
  inputPasswordConfirmation:string = "";
  cbUserIsActive:boolean = false;
  
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

  initEditUser(): void{
    this.inputName = "";
    this.inputCurrentPassword = "";
    this.inputPassword = "";
    this.inputPasswordConfirmation = "";
  }

  onClickEdit(userId:number){
    Swal.fire({
      title: 'Do you want to edit',
      text: `User ID : ${userId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Edit',
      cancelButtonText: 'Cancel'
    }).then(
      (result) => {
        if(result.isConfirmed){
          this.initEditUser();
          this.displayModalEditUser = true;

          const user:IUser = <IUser>this.users.find(u => u.id == userId);
          this.editUserId = user.id;
          this.inputUserName = user.username;
          this.cbUserIsActive = user.is_active;
        }
      }
    );
  }

  editUser():void{
    this.displayModalEditUser = false;

    this.usersService.Update(this.editUserId,this.inputName,this.inputUserName,this.inputCurrentPassword,this.inputPassword,this.inputPasswordConfirmation,this.cbUserIsActive).subscribe((res:any) => {
      if(res?.success)
      {
        Swal.fire({
          title: `User ID : ${this.editUserId} is edited`,
          text: res?.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
            this.getListUsers();
          }
        );
      }
      else
      {
        Swal.fire({
          title: `Error!!! ${this.editUserId} can't edit`,
          text: res?.message,
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
            this.getListUsers();
          }
        );
      }
    })
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
        Swal.fire({
          title: `User ID : ${userId} is reset`,
          text: res?.message,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
      else{
        Swal.fire({
          title: `Error!!! ${userId} can't reset`,
          text: res?.message,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    });
  }

  onClickDelete(userId:number){
    Swal.fire({
      title: 'Do you want to delete',
      text: `User ID : ${userId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(
      (result) => {
        if(result.isConfirmed){
          this.usersService.Delete(userId).subscribe((res:any) => {
            if(res?.success)
            {
              Swal.fire({
                title: `User ID : ${userId} is deleted`,
                text: res?.message,
                icon: 'success',
                showCancelButton: true
              }).then(
                (result) => {
                  this.getListUsers();
                }
              );
            }
            else{
              Swal.fire({
                title: `Error!!! ${userId} can't delete`,
                text: res?.message,
                icon: 'error',
                showCancelButton: true
              }).then(
                (result) => {
                  this.getListUsers();
                }
              );
            }
          });
        }
      });
  }
}
