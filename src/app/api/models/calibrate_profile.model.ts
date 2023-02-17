export interface IGetLastCalibrateDetailResponse{
    success:boolean,
    message:string,
    calibrate_profile:ICalibrateProfile,
}

export interface ICalibrateProfile{
    id:number,
    name:string,
    avg_pressure:number,
    avg_temp:number,
    avg_gas_1:number,
    avg_gas_2:number,
    avg_gas_3:number,
    avg_gas_4:number,
    avg_gas_5:number,
    avg_gas_6:number,
    avg_gas_7:number,
    count_calibrate_items:number,
    created_at:string,
    device_id:number,
    updated_at:string,
}

export interface IShowCollectCalibrateProfile{
    calibrate_profile_id:number,
    created_at:string,
    gas_1:number,
    gas_2:number,
    gas_3:number,
    gas_4:number,
    gas_5:number,
    gas_6:number,
    gas_7:number,
    id:number,
    pressure:number,
    temp:number,
    updated_at:string,
}