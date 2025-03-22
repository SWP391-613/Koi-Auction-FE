import { HttpHandler } from "msw";
import { getAllAuction_Pag_Req } from "./auctions.msw";

export const handlers: HttpHandler[] = [getAllAuction_Pag_Req()];
