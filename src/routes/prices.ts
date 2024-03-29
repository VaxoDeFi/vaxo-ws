import express from "express";
var server = express.Router();
import type { Request, Response } from "express";
import {
  getApiCoinAssets,
  getApiMessari,
  getAsset,
  insertMessari,
} from "../services/assets";
import vaxoResponses from "../utilities/vaxoResponses";
import { allMessari, getMessariByPage } from "../db/pg/messari";

// Get 100 results of APICOIN prices [ Not used right now ] TO MOVE
server.get("/apicoin/prices", async (req: Request, res: Response) => {
  try {
    const assets = await getApiCoinAssets();
    vaxoResponses.json(req, res, assets);
  } catch (e) {
    res.status(500).end("[API:PRICES] Couldn't fetch prices assets | " + e);
  }
});

// Update Messari prices
server.get("/messari/update", async (req: Request, res: Response) => {
  try {
    const assets = await getApiMessari();
    await insertMessari(assets.data.data);
    vaxoResponses.done(res);
  } catch (e) {
    res.status(500).end("[API:PRICES] Couldn't fetch prices assets | " + e);
  }
});

// Return all the prices of Messari from DB
server.get("/messari/price", async (req: Request, res: Response) => {
  try {
    const data = await allMessari();
    vaxoResponses.json(req, res, data);
  } catch (e) {
    res.status(500).end("[API:PRICES] Couldn't fetch prices assets | " + e);
  }
});

// Return 25 first results of Messari
server.get("/messari/price/:rows", async (req: Request, res: Response) => {
  try {
    const rows = req.params.rows;
    const data = await getMessariByPage(Number(rows));
    vaxoResponses.json(req, res, data);
  } catch (e) {
    res.status(500).end("[API:PRICES] Couldn't fetch prices assets | " + e);
  }
});

// Get the graph of any coins from Binance
server.get("/price/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const assets = await getAsset(id);
    res.status(200).send(assets);
  } catch (e) {
    res.status(500).end("[API:PRICE] Couldn't fetch price asset | " + e);
  }
});

// server.get("/dex/prices", async (req: Request, res: Response) => {
//   try {
//     const assets = await getApiCoinAssets();
//     res.status(200).send(assets.data);
//   } catch (e) {
//     res.status(500).end("[API:PRICES] Couldn't fetch prices assets | " + e);
//   }
// });

// server.get("/dex/price/:id", async (req: Request, res: Response) => {
//   try {
//     const assets = await getApiCoinAssets();
//     res.status(200).send(assets.data);
//   } catch (e) {
//     res.status(500).end("[API:PRICES] Couldn't fetch prices assets | " + e);
//   }
// });

export default server;
