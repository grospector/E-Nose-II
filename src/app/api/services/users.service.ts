import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { Role } from 'src/app/models/common/role';
import { IUser } from 'src/app/models/common/user';
import { environment } from 'src/environments/environment';
import { IListUsersReponse } from '../models/user.model';

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
}
