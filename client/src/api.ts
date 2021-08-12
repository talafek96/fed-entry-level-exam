import axios from "axios";
import { APIRootPath } from "@fed-exam/config";
import { ResDict } from "../../server/index";

export type Ticket = {
  id: string;
  title: string;
  content: string;
  creationTime: number;
  userEmail: string;
  labels?: string[];
};

export type ReqArgs = {
  reqno: number;
  search?: string;
  page?: number;
  hiddenList?: Set<string>;
};

export type ReqArrayArgs = {
  reqno: number;
  search?: string;
  page?: number;
  hiddenList?: Array<string>;
};

export type ApiClient = {
  getTickets: (args: ReqArgs) => Promise<ResDict>;
};

const convertArgs = (setArgs: ReqArgs) => {
  let arr = new Array<string>();
  if (setArgs.hiddenList) {
    setArgs.hiddenList!.forEach((element) => {
      arr.push(element);
    });
  }
  let newArgs: ReqArrayArgs = { ...setArgs, hiddenList: arr };
  return newArgs;
};

export const createApiClient = (): ApiClient => {
  return {
    getTickets: (args: ReqArgs) => {
      const defaultArgs: ReqArgs = { reqno: 0, hiddenList: new Set<string>() };
      let safeArgs = Object.assign(defaultArgs, args);

      let safeArrayArgs: ReqArrayArgs = convertArgs(safeArgs);
      return axios
        .get(APIRootPath, { params: safeArrayArgs })
        .then((res) => res.data);
    },
  };
};
