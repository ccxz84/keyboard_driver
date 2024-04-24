import * as grpc from '@grpc/grpc-js';
import { RestartClient, RestartRequest } from '../../generated/restart_service';

class RestartGrpcClient {
    // gRPC 클라이언트 인스턴스를 생성합니다.
  client;
  private address: string;
  
  constructor() {
    this.address = '10.55.0.1';
    this.client = new RestartClient(`${this.address}:50052`, grpc.credentials.createInsecure());
  }

  updateAddress(newAddress: string) {
    if (newAddress !== this.address) {
      this.address = newAddress;
      this.client = new RestartClient(`${this.address}:50052`, grpc.credentials.createInsecure());
      console.log(`Address updated to ${this.address}:50052`);
    }
  }

  restartRequest(request: RestartRequest) {
    this.client.RestartProcess(request, (error, response) => {
      if (error) {
        console.error('Error:', error);
        return;
      }
      console.log('Response:', response);
    });
  }
}

export default new RestartGrpcClient();
