import { HttpHandler } from "msw";
import { getAllAuction_Pag_Req } from "./auctions.msw";
import { getBreederListReq } from "./breeders.msw";
import { getKoiListByKeyWord_Req } from "./kois.msw";

export const handlers: HttpHandler[] = [
  getAllAuction_Pag_Req(),
  getBreederListReq(),
  getKoiListByKeyWord_Req(),
];
