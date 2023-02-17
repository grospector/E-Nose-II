import { InjectSetupWrapper } from "@angular/core/testing";
import { ICaseDetail } from "src/app/api/models/case.model";
import { IDevice } from "src/app/api/models/device.model";
import { ISession, ILoginReponse } from "src/app/models/common/login";
import { Role } from "src/app/models/common/role";
import { IUser } from "src/app/models/common/user";
import { StateCalibration } from "src/app/modules/testing/testing";

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

  static SetCurrentDevice(iDevice:IDevice){
    localStorage.setItem("device",JSON.stringify(iDevice));
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

  static SetCurrentIDCard(selectedIDCard:ICaseDetail){
    localStorage.setItem("IDCard",JSON.stringify(selectedIDCard));
  }

  static GetCurrentIDCard() : ICaseDetail{
    var IDCard = localStorage.getItem("IDCard");
    if(IDCard == "" || IDCard == null)
    {
      return <ICaseDetail>{
        id: -1,
        id_card: "",
        name: "",
        phone_number: "",
        last_status: "",
        created_at: "",
        updated_at: "",
      }
    }
    else{
      var idCard = <ICaseDetail>JSON.parse(IDCard);
      return <ICaseDetail>{
        id: idCard.id,
        id_card: idCard.id_card,
        name: idCard.name,
        phone_number: idCard.phone_number,
        last_status: idCard.last_status,
        created_at: idCard.created_at,
        updated_at: idCard.updated_at,
      }
    }
  }

  static ClearStateClibration(){
    localStorage.setItem("StateCalibration","");
  }

  static SetCurrentStateCalibration(state:StateCalibration){
    localStorage.setItem("StateCalibration",state.toString());
  }

  static GetCurrentStateCalibration() : StateCalibration{
    const stateCalibration = (localStorage.getItem("StateCalibration") || StateCalibration.PreCalibratation) as StateCalibration;

    return stateCalibration
  }

  static ClearStateStatus(){
    localStorage.setItem("StateStatus","READY");
  }

  static SetCurrentStateStatus(state:string){
    localStorage.setItem("StateStatus",state);
  }

  static GetCurrentStateStatus() : string{
    const state = localStorage.getItem("StateStatus") || "READY";
    return state
  }
}