export interface IDevice{
    id: Number,
    name: string,
    mac_serial_no: string,
    status: string,
    is_connecting: boolean,
    is_active: boolean,
    connecting_user_name: string,
    created_at: string,
    updated_at: string,
    working_test_id: string,
    connecting_user_id: string
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