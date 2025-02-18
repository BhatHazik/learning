import {io} from 'socket.io-client';
import { BASE_URI } from './Config/url';
export let socket;

export const socketConnect = (token = null) => {
    // const socketUrl = `${BASE_URI}/?token=${token}`
    
    
    try {
        // socket = io(socketUrl, {
        //     transports: ['websocket'], // Force WebSocket transport
        //     autoConnect: false, // Don't connect automatically
        // });

        // socket.connect();

        

    

    } catch (e) {
      
    }
}