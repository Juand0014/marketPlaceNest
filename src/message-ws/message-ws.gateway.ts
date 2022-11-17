import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
      private readonly messageWsService: MessageWsService,
      private readonly jwtService: JwtService,
    ) {}

  async handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify( token )
      await this.messageWsService.registerClient( client, payload.id );

    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload })

    
    this.wss.emit( 'clients-updated', this.messageWsService.getConnectedClient() )
  }

  handleDisconnect( client: Socket ) {
    this.messageWsService.removeClient( client.id )

    this.wss.emit( 'clients-updated', this.messageWsService.getConnectedClient() )
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto) {
    // message-from-server

    //! Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // })

    //! Emite a todos MENOS, al client inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // })

    this.wss.emit( 'message-from-server' , {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });

  }
}