import { Client } from "@stomp/stompjs";
import { environment } from "~/environments/environment";
import SockJS from "sockjs-client";
import { BidRequest } from "~/pages/auctions/KoiBidding";

let stompClient: Client | null = null;
let subscriptions: { [key: string]: ((message: any) => void)[] } = {};

export const connectWebSocket = (onConnect: () => void) => {
  console.log("Attempting to connect to WebSocket");
  const socket = new SockJS(
    `${environment.be.baseUrl}${environment.be.endPoint.socket}`,
  );

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      // Add any necessary headers here
    },
    debug: (str) => {
      console.log("STOMP debug:", str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log("STOMP connection established");
    console.log("Connected to:", frame.headers["server"]);
    console.log("Session ID:", frame.headers["session-id"]);
    onConnect();
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP error:", frame.headers["message"]);
    console.error("Additional details:", frame.body);
  };

  stompClient.activate();

  return stompClient;
};

export function disconnectWebSocket() {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }
}

export function placeBid(bid: BidRequest) {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: `/app/auctionkoi/${bid.auction_koi_id}/bid`,
      body: JSON.stringify(bid),
    });
  } else {
    console.error("WebSocket connection not established");
  }
}

export function subscribeToAuctionUpdates(
  auctionKoiId: number,
  callback: (message: any) => void,
) {
  if (stompClient && stompClient.active) {
    const destination = `/topic/auctionkoi/${auctionKoiId}`;
    const subscription = stompClient.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (subscriptions[destination]) {
        subscriptions[destination].forEach((cb) => cb(parsedMessage));
      }
    });

    if (!subscriptions[destination]) {
      subscriptions[destination] = [];
    }
    subscriptions[destination].push(callback);

    return () => {
      subscription.unsubscribe();
      subscriptions[destination] = subscriptions[destination].filter(
        (cb) => cb !== callback,
      );
    };
  } else {
    console.error("WebSocket connection not established");
    return () => {};
  }
}

export function unsubscribeFromAuctionUpdates(
  auctionKoiId: number,
  callback: (message: any) => void,
) {
  const destination = `/topic/auctionkoi/${auctionKoiId}`;
  if (subscriptions[destination]) {
    subscriptions[destination] = subscriptions[destination].filter(
      (cb) => cb !== callback,
    );
  }
}
