import * as grpc from '@grpc/grpc-js';
import { StartRequest, StopRequest, InputClient } from '../../generated1/input_service';

class MacroGrpcClient {
    // gRPC 클라이언트 인스턴스를 생성합니다.
  client;
  
  constructor() {
    this.client = new InputClient('10.55.0.1:50051', grpc.credentials.createInsecure());
    // this.client.StartRecording.bind(this.client);
    // this.client.StopRecording.bind(this.client);
  }

  startRequest(request: StartRequest) {
    this.client.StartRecording(request, (error, response) => {
      if (error) {
        console.error('Error:', error);
        return;
      }
      console.log('Response:', response);
    });
  }

  stopRequest(request: StopRequest) {
    this.client.StopRecording(request, (error, response) => {
      if (error) {
        console.error('Error:', error);
        return;
      }
      console.log('Response:', response);
    });
  }
}

export default new MacroGrpcClient();
