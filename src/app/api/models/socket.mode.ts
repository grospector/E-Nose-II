import { IShowCollectCalibrateProfile } from "./calibrate_profile.model";
import { ICollectingData, IStatus } from "./data.model";

export interface ISocketResponse{
    _ch: string,
    command: string,
    data: ICollectingData
}

export interface IStatusSocketResponse{
    _ch: string,
    command: string,
    data: IStatus
}

export interface ICalibrateSocketResponse{
    _ch: string,
    command: string,
    data: IShowCollectCalibrateProfile
}