import { ICalibrateItem } from "./calibrate_profile.model"

export interface IStartPreTestRequest{
    case_id:number,
    name:string,
    note:string
}

export interface ITestsGetListResponse{
    success:boolean,
    message:string,
    tests:ITest[]
}

export interface ITest{
    id:number,
    name:string,
    status:string,
    user_name:string,
    device_name:string,
    note:string,
    note_system:string,
    score:number,
    start_time_collecting:string,
    end_time_collecting:string,
    start_time_analyzing:string,
    end_time_analyzing:string,
    calibrate_profile_id:number,
    created_at:string,
    updated_at:string,
    case_id:number,
    user_id:number,
    device_id:number,
    case_name:string
}

export interface ITestDetail{
    calibrate_profile:ICalibrateItem,
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

export interface ITestDetailResponse{
    success:boolean,
    test:ITestDetail,
    message:string
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