export interface IDevice{
    id: number,
    name: string
}

export interface IListDevicesReponse{
    success: boolean,
    devices: IDevice[],
    count_total: number
}

export interface IConnectResponse{
    success: boolean,
    message: string
}