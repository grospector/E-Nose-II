import { ICalibrateProfile } from "./calibrate_profile.model";

export interface ITestDetailResponse{
    calibrate_profile:ICalibrateProfile,
    calibrate_profile_id:number,
    case_id:number,
    case_name:number,
    count_test_items:number,
    created_at:string,
    device_id:number,
    device_name:string,
    end_time_analyzing:string,
    end_time_collecting:string,
    id:number,
    name:string,
    note:string,
    note_system:string,
    score:number,
    start_time_analyzing:string,
    start_time_collecting:string,
    status:string,
    test_item_dif_calibrates:IDifCalibrate[],
    test_items:IItem[],
    updated_at:string,
    user_id:number,
    user_name:string
}

export interface IDifCalibrate{
    pressure:number,
    temp:number,
    gas_1:number,
    gas_2:number,
    gas_3:number,
    gas_4:number,
    gas_5:number,
    gas_6:number,
    gas_7:number,
    gas_8:number,
}

export interface IItem{

}