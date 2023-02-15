export interface ICaseDetail{
    id: number;
    id_card: string;
    name: string;
    phone_number: string;
    last_status: string;
    created_at: string;
    updated_at: string;
}

export interface IGetListCasesResponse{
    success:boolean;
    cases:ICaseDetail[];
    count_total:number;
    message:string;
}