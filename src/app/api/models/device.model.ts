export interface IDevice{
    connecting_user_id: string,
    connecting_user_name: string,
    created_at: string,
    id: Number,
    is_active: boolean,
    is_connecting: boolean,
    mac_serial_no: string,
    name: string,
    status: string,
    updated_at: string,
    working_test_id: string,
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

export interface IGetDeviceDetailResponse{
    device: IDevice,
    success: boolean,
}