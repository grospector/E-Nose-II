import { IShowCollectCalibrateProfile } from "./calibrate_profile.model";
import { ICollectingData } from "./data.model";

export interface ISocketResponse{
    _ch: string,
    command: string,
    data: ICollectingData
}

export interface ICalibrateSocketResponse{
    _ch: string,
    command: string,
    data: IShowCollectCalibrateProfile
}