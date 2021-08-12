import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';
import { ResDict } from '../../server/index'

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ReqArgs = {
    reqno: number,
    search?: string,
    page?: number,
    hiddenList?: Set<string>
}

export type ApiClient = {
    getTickets: (args: ReqArgs) => Promise<ResDict>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (args: ReqArgs) => {
            const defaultArgs: ReqArgs = {reqno: 0, hiddenList: new Set<string>()};
            let safeArgs = Object.assign(defaultArgs, args);
            return axios.get(APIRootPath, { params: safeArgs }).then((res) => res.data);
        }
    }
}
