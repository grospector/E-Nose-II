export enum EnumOrderBy{
    CreateAtDesc = "created_at+desc",
    CreateAtAsc = "created_at+asc"
}

export enum EnumConnectionStatus{
    Ready = "ready",
    WaitingConnection = "waiting_connection",
    Test = "test",
    StopTest = "stop_test",
    PreCalibrate = "pre-calibrate",
    Cleaning = "cleaning",
    StartPreProcessing = "start_pre-processing",
    EndPreProcessing = "end_pre-processing",
    PreProcessing = "pre-processing",
    Processing = "processing"
}

export enum EnumSocketCommand{
    ChangeStatus = "change_status",
    ShowTestData = "show_test_data",
    ShowCollectData = "show_collect_data",
    ShowCollectCalibrateData = "show_collect_calibrate_data"
}