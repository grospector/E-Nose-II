import { InjectSetupWrapper } from "@angular/core/testing";
import { IDevice } from "src/app/api/models/device.model";
import { ILoginReponse, ISession } from "src/app/models/common/login";
import { Role } from "src/app/models/common/role";
import { IUser } from "src/app/models/common/user";

export class AuthUtils
{
static GetSession() : ISession {
    var session = sessionStorage.getItem("user");
    if(session == "" || session == null)
    {
        return <ISession>{
            id: 0,
            access_token: '',
            created_at: '',
            updated_at: '',
            user_id: 0,
            user: <IUser>{
                id: 0,
                firstName: '',
                lastName: '',
                username: '',
                role: Role.None
            } 
        }
    }
    else{
        var sessionJson = <ILoginReponse>JSON.parse(session);
        return sessionJson.session;
    }
}

  static GetSessionUser() : IUser {
    var session = sessionStorage.getItem("user");
    if(session == "" || session == null)
    {
      return <IUser>{
        id: 0,
        firstName: "-",
        lastName: "-",
        username: "None",
        role: Role.None
      }
    }
    else{
      var sessionJson = <ILoginReponse>JSON.parse(session);
      return sessionJson.session.user;
    }
  }

  static GetSessionDevice() : IDevice {
    var session = sessionStorage.getItem("device");
    if(session == "" || session == null)
    {
      return <IDevice>{
        id: 0,
        name:'-'
      }
    }
    else{
    //   var sessionJson = <ILoginReponse>JSON.parse(session);
    //   return sessionJson.session.user;
      return <IDevice>{
        id: 999,
        name:'Mock'
      }
    }
  }
}