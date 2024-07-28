import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'net';

@WebSocketGateway()
export class TestGateway {
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any): string {
		client.emit('message', 'Hello world!');
		return 'Hello world!';
	}
}
