import express from "express";
import bodyParser = require("body-parser");
import { tempData } from "./temp-data";
import { serverAPIPort, APIPath } from "@fed-exam/config";
import { Ticket } from "../client/src/api";

console.log("starting server", { serverAPIPort, APIPath });

export type ResDict = {
  tickets: Ticket[];
  pageCount: number;
  pageSize: number;
  totalCount: number;
};

declare type SearchRes = {
  search: string;
  result: ResDict;
};

const app = express();

const PAGE_SIZE = 20;

const MAX_TLB_SIZE = 100;
let TLB: SearchRes[] = [];
let cyclic: number = 0;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const tlbLookup = (search: string) => {
  if (search === "") {
    return {
      tickets: tempData,
      pageCount: Math.ceil(tempData.length / PAGE_SIZE),
      pageSize: PAGE_SIZE,
      totalCount: tempData.length,
    };
  }
  let result = TLB.find((element) => element.search === search);
  if (result === undefined) {
    const filtered = tempData.filter((entry) => {
      if (
        (
          entry["title"].toLowerCase() + entry["content"].toLowerCase()
        ).includes(search)
      ) {
        return true;
      }
      return false;
    });
    let res = {
      tickets: filtered,
      pageCount: Math.ceil(filtered.length / PAGE_SIZE),
      pageSize: PAGE_SIZE,
      totalCount: filtered.length,
    };

    TLB[cyclic] = {
      search: search,
      result: res,
    };
    cyclic = (cyclic + 1) % MAX_TLB_SIZE;

    return res;
  }
  return result.result;
};

// This should be used if any time change/update is done to the database:
const tlbFlush = () => {
  TLB = [];
};

app.get(APIPath, (req, res) => {
  // @ts-ignore\
  let hiddenList: Set<string>;
  if (req.query.hiddenList) {
    hiddenList = new Set<string>(req.query.hiddenList);
  } else {
    hiddenList = new Set<string>();
  }

  if (req.query.reqno === "0") {
    if (!req.query.search) {
      const page: number = req.query.page || 1;
      let count = 0;
      const paginatedData = tempData
        .filter((entry) => {
          if (hiddenList.has(entry.id)) {
            return false;
          }
          count++;
          return true;
        })
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      let resDict: ResDict = {
        tickets: paginatedData,
        pageCount: Math.ceil(tempData.length / PAGE_SIZE),
        pageSize: PAGE_SIZE,
        totalCount: count,
      };
      res.send(resDict);
      return;
    }
    const search = req.query["search"]!.toLowerCase();
    const lookup = tlbLookup(search);
    const searchRes = lookup.tickets.filter((entry) => {
      if (hiddenList.has(entry.id)) {
        return false;
      }
      return true;
    });

    const page: number = req.query.page || 1;
    let resDict: ResDict = {
      tickets: searchRes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      pageCount: Math.ceil(searchRes.length / PAGE_SIZE),
      pageSize: PAGE_SIZE,
      totalCount: searchRes.length,
    };
    res.send(resDict);
    return;
  } else if (req.query.reqno === "1") {
    // Calculate number of pages.
    res.send(Math.ceil(tempData.length / PAGE_SIZE));
    return;
  } else {
    const page: number = req.query.page || 1;
    const paginatedData = tempData
      .filter((entry) => {
        if (hiddenList.has(entry.id)) {
          return false;
        }
        return true;
      })
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    let resDict: ResDict = {
      tickets: paginatedData,
      pageCount: Math.ceil(tempData.length / PAGE_SIZE),
      pageSize: PAGE_SIZE,
      totalCount: tempData.length,
    };
    res.send(resDict);
    return;
  }
});

app.listen(serverAPIPort);
console.log("server running", serverAPIPort);
