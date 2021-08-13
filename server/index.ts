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

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

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
    const searchRes = tempData.filter((entry) => {
      if (
        (
          entry["title"].toLowerCase() + entry["content"].toLowerCase()
        ).includes(search)
      ) {
        if (hiddenList.has(entry.id)) {
          return false;
        }
        return true;
      }
      return false;
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
