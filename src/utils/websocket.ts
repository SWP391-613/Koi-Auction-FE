import { Client } from "@stomp/stompjs";
import { environment } from "~/environments/environment";
import SockJS from "sockjs-client";
import { BidRequest } from "~/pages/auctions/KoiBidding";
import { API_URL, API_URL_DEVELOPMENT } from "~/constants/endPoints";

let stompClient: Client | null = null;
let subscriptions: { [key: string]: any } = {};

export const connectWebSocket = (onConnect: () => void) => {
  const socket = new SockJS(
    `${API_URL_DEVELOPMENT}${environment.be.endPoint.socket}`,
    undefined,
    { withCredentials: true },
  );

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log("STOMP debug:", str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log("STOMP connection established");
    onConnect();
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP error:", frame.headers["message"]);
    stompClient?.deactivate();
    setTimeout(() => stompClient?.activate(), 5000);
  };

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () =>
  stompClient?.active && stompClient.deactivate();

export const placeBid = (bid: BidRequest) => {
  if (stompClient?.active) {
    stompClient.publish({
      destination: `/app/auctionkoi/${bid.auction_koi_id}/bid`,
      body: JSON.stringify(bid),
    });
  } else {
    console.error("WebSocket connection not established");
  }
};

export const subscribeToAuctionUpdates = (
  auctionKoiId: number,
  callback: (message: any) => void,
) => {
  if (stompClient?.active) {
    const destination = `/topic/auctionkoi/${auctionKoiId}`;
    subscriptions[destination]?.unsubscribe();

    subscriptions[destination] = stompClient.subscribe(
      destination,
      (message) => {
        callback(JSON.parse(message.body));
      },
    );

    return () => {
      subscriptions[destination]?.unsubscribe();
      delete subscriptions[destination];
    };
  } else {
    console.error("WebSocket connection not established");
    return () => {};
  }
};

export const unsubscribeFromAuctionUpdates = (auctionKoiId: number) => {
  const destination = `/topic/auctionkoi/${auctionKoiId}`;
  subscriptions[destination]?.unsubscribe();
  delete subscriptions[destination];
};
