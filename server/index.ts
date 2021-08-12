import express from "express";
import bodyParser = require("body-parser");
import { tempData } from "./temp-data";
import { serverAPIPort, APIPath } from "@fed-exam/config";

console.log("starting server", { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 2000;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get(APIPath, (req, res) => {
  // @ts-ignore\
  if (req.query.reqno === "0") {
    // Find a search query / fetch page query
    if (!req.query.search) {
      const page: number = req.query.page || 1;
      const paginatedData = tempData.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      );
      let resDict = {
        tickets: paginatedData,
        pageCount: Math.ceil(tempData.length / PAGE_SIZE),
      };
      res.send(resDict);
      return;
    }
    const search = req.query["search"]!.toLowerCase();
    const searchRes = tempData.filter((entry) => {
      (entry["title"].toLowerCase() + entry["content"].toLowerCase()).includes(
        search
      );
    });
    const page: number = req.query.page || 1;
    let resDict = {
      tickets: searchRes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      pageCount: Math.ceil(searchRes.length / PAGE_SIZE),
    };
    res.send(resDict);
    return;
  } else if (req.query.reqno === "1") {
    // Calculate number of pages.
    res.send(Math.ceil(tempData.length / PAGE_SIZE));
    return;
  } else {
    const page: number = req.query.page || 1;
    const paginatedData = tempData.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
    let resDict = {
      tickets: paginatedData,
      pageCount: Math.ceil(tempData.length / PAGE_SIZE),
    };
    res.send(resDict);
    return;
  }
});

app.listen(serverAPIPort);
console.log("server running", serverAPIPort);
