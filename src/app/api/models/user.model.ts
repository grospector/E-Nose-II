import { IUser } from "src/app/models/common/user"

export interface IListUsersReponse{
    success: boolean,
    users: IUser[],
    count_total: number
}