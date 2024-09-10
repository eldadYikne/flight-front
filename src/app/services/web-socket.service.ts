import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://flight-api-73ie.onrender.com', {
      withCredentials: true, // Include credentials if necessary
    });
  }

  // Method to emit events to the server
  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Method to listen for events from the server
  listen(event: string) {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
