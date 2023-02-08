import { IUser } from "src/app/models/common/user"
import { IDevice } from "./device.model"

export interface IListUsersReponse{
    success: boolean,
    users: IUser[],
    count_total: number
}

export interface IGetConnectedDeviceResponse{
    case: string,
    success: boolean,
    device : IDevice,
    test: string
}