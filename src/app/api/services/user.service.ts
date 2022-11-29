import { Injectable } from '@angular/core';
import { ILoginReponse, ISession } from 'src/app/models/common/login';
import { Role } from 'src/app/models/common/role';
import { IUser } from 'src/app/models/common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  GetSessionUser() : IUser {
    var session = sessionStorage.getItem("user");
    if(session == "" || session == null)
    {
      return <IUser>{
        id: 0,
        firstName: "",
        lastName: "",
        username: "None",
        role: Role.Staff,
        token: "",
      }
    }
    else{
      var sessionJson = <ILoginReponse>JSON.parse(session);
      return sessionJson.session.user;
    }
  }
}
