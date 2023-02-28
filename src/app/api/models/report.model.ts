export interface IGetReportsDashboardResponse{
    success:boolean;
    message:string;
    result:IResultReport;
}

export interface IResultReport{
    count_date_test: number,
    count_history_case: number,
    count_history_test: number,
    history_test_group_scores: IHistoryTestGroupScores[]
}

export interface IHistoryTestGroupScores{
    score: number,
    count: number,
    percent: number
}