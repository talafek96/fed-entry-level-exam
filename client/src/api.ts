import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    isHidden?: boolean;
}

export type ReqArgs = {
    reqno: number,
    search?: string,
    page?: number
}

export type ResDict = {
    tickets: Ticket[],
    pageCount: number
}

export type ApiClient = {
    getTickets: (args: ReqArgs) => Promise<ResDict>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (args: ReqArgs) => {
            const defaultArgs: ReqArgs = {reqno: 0};
            let safeArgs = Object.assign(defaultArgs, args);
            return axios.get(APIRootPath, { params: safeArgs }).then((res) => res.data);
        }
    }
}
