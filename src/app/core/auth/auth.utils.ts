import { InjectSetupWrapper } from "@angular/core/testing";
import { IDevice } from "src/app/api/models/device.model";
import { ISession, ILoginReponse } from "src/app/models/common/login";
import { Role } from "src/app/models/common/role";
import { IUser } from "src/app/models/common/user";

export class AuthUtils
{
  static GetLocalStorage() : ISession {
    var local = localStorage.getItem("user");
    if(local == "" || local == null)
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
        var localStorageJson = <ILoginReponse>JSON.parse(local);
        return localStorageJson.session;
    }
}

  static GetCurrentUser() : IUser {
    var local = localStorage.getItem("user");
    if(local == "" || local == null)
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
      var localStorageJson = <ILoginReponse>JSON.parse(local);
      return localStorageJson.session.user;
    }
  }

  static GetCurrentDevice() : IDevice {
    var local = localStorage.getItem("device");
    if(local == "" || local == null)
    {
      return <IDevice>
      {
        id: -1,
        name:'-',
        mac_serial_no: '-:0',
        status: '-',
        is_connecting: false,
        is_active: false,
        connecting_user_name: '',
        created_at: '',
        updated_at: '',
        working_test_id: '',
        connecting_user_id: ''
      }
    }
    else
    {
      var device = <IDevice>JSON.parse(local);
      return <IDevice>{
        id: device.id,
        name: device.name,
        mac_serial_no: device.mac_serial_no,
        status: device.status,
        is_connecting: device.is_connecting,
        is_active: device.is_active,
        connecting_user_name: device.connecting_user_name,
        created_at: device.created_at,
        updated_at: device.updated_at,
        working_test_id: device.working_test_id,
        connecting_user_id: device.connecting_user_id
      }
    }
  }
}