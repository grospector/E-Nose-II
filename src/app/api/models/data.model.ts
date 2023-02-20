import { EnumConnectionStatus } from "src/app/models/common/enum";

export interface ICollectingData{
    test_item:ITestItem;
}

export interface ITestItem{
    pressure: number,
    temp: number,
    gas_1: number,
    gas_2: number,
    gas_3: number,
    gas_4: number,
    gas_5: number,
    gas_6: number,
    gas_7: number,
    test_id: number
}

export interface IStatus{
    status:EnumConnectionStatus
}