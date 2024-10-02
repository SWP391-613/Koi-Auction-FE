import { Client } from "@stomp/stompjs";
import { environment } from "~/environments/environment";
import SockJS from "sockjs-client";
import { BidRequest } from "~/pages/auctions/KoiBidding";

let stompClient: Client | null = null;

export const connectWebSocket = () => {
  console.log("Attempting to connect to WebSocket");
  const socket = new SockJS(
    environment.ws.baseUrl + environment.ws.apiPrefix,
    null,
    {
      transports: ["websocket"],
      withCredentials: true,
    },
  );

  socket.onopen = () => {
    console.log("SockJS connection opened");
  };

  socket.onerror = (error) => {
    console.error("SockJS error:", error);
  };

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

  stompClient.onConnect = () => {
    console.log("STOMP connection established");
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
      destination: "/app/placeBid",
      body: JSON.stringify(bid),
    });
  } else {
    console.error("WebSocket connection not established");
  }
}

export function subscribeToAuction(
  auctionId: number,
  callback: (message: any) => void,
) {
  if (stompClient && stompClient.active) {
    stompClient.subscribe(`/topic/auction/${auctionId}`, (message) => {
      callback(JSON.parse(message.body));
    });
  } else {
    console.error("WebSocket connection not established");
  }
}
