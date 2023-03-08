export enum StateTesting{
    Cleaning = 0,
    Menu = 1,
    CheckDeviceInit = 2,
    Calibrate = 3,
    StartProcessCollectingData = 4
}

export enum CheckDeviceInitStep{
    StepTest = 1,
    StepStopTesting = 2,
    StepCleaning = 3
}

export enum CalibrationStep{
    StepPreCalibration = 1,
    StepStartCalibration = 2,
    StepStopCalibration = 3,
    StepFinishProcess = 4,
    StepCleaning = 5
}

export enum StartProcessCollectingDataStep{
    StepStartPreProcessing = 1,
    StepEndPreProcessing = 2,
    StepProcessing = 3,
    StepStopCollectingData = 4,
    StepFinishProcess = 5,
    StepShowResult = 6,
    StepCleaning = 7
}