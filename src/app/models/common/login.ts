import { IUser } from "./user"

export interface ILoginReponse{
    success: boolean,
    session: ISession
}

export interface ISession{
    id: number,
    access_token: string,
    created_at: string,
    updated_at: string,
    user_id: number,
    user: IUser 
}