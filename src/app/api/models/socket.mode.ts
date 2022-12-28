import { ICollectingData } from "./data.model";

export interface ISocketResponse{
    _ch: string,
    command: string,
    data: ICollectingData
}