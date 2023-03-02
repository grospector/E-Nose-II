import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { Role } from 'src/app/models/common/role';
import { IUser } from 'src/app/models/common/user';
import { environment } from 'src/environments/environment';
import { IConnectResponse } from '../models/device.model';
import { IGetConnectedDeviceResponse, IListUsersReponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  BaseUrl:string = environment.apiUrl + "/users";

  constructor(private http:HttpClient) { }

  GetListUsers(): Observable<IListUsersReponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    return this.http.get<IListUsersReponse>(
      this.BaseUrl,
      {
        headers: httpHeaders
      }
    );
  }

  GetConnectedDeviceDetail(): Observable<IGetConnectedDeviceResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    return this.http.get<IGetConnectedDeviceResponse>(
      this.BaseUrl+"/get_connected_device",
      {
        headers: httpHeaders
      }
    );
  }

  ResetPassword(userId:number): Observable<any>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    const body = {
      "target_user_id":userId
    };

    return this.http.post<any>(
      this.BaseUrl + '/reset_password_admin',
      body,
      {
        headers: httpHeaders
      }
    );
  }

  
  Update(userId:number,name:string,userName:string,currentPassword:string,password:string,passwordConfirmation:string,isActive:boolean): Observable<any>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    const body =  {
      "name":name,
      "userName":userName,
      "current_password":currentPassword,
      "password":password,
      "password_confirmation":passwordConfirmation,
      "is_active":isActive
    };
    
    return this.http.put<any>(
      this.BaseUrl + '/' + userId,
      body,
      {
        headers: httpHeaders
      }
    );
  }

  Delete(userId:number): Observable<any>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.delete<any>(
      this.BaseUrl + '/' + userId,
      {
        headers: httpHeaders
      }
    );
  }
}
