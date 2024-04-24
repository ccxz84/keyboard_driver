import * as grpc from '@grpc/grpc-js';
import { StartRequest, StopRequest, InputClient, ListRequest, StopReplayRequest, ReplayRequest, StatusResponse, SaveFilesResponse, GetMacroDetailRequest, GetMacroDetailResponse, DeleteMacrosRequest, ComplexReplayRequest } from '../../generated/input_service';

class MacroGrpcClient {
    // gRPC 클라이언트 인스턴스를 생성합니다.
  client;
  private address: string;
  
  constructor() {
    this.address = '10.55.0.1';
    this.client = new InputClient(`${this.address}:50051`, grpc.credentials.createInsecure());
  }

  updateAddress(newAddress: string) {
    if (newAddress !== this.address) {
      this.address = newAddress;
      this.client = new InputClient(`${this.address}:50051`, grpc.credentials.createInsecure());
      console.log(`Address updated to ${this.address}:50051`);
    }
  }

  deleteMacros(request: DeleteMacrosRequest) {
    console.log(request);
    this.client.DeleteMacros(request, (error, response) => {
      if (error) {
        console.error('Error:', error);
        return;
      }
      console.log('Response:', response);
    });
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

  listMacros() {
    return new Promise<string[]>((resolve, reject) => {
      const request = new ListRequest();
      this.client.ListSaveFiles(request, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response ? response.filenames : [] );
      });
    });
  }

  replayMacroDebug(request: ReplayRequest) {
    console.log('asdfa');
    const call = this.client.ReplayMacroDebug(request);
    return call;
  }

  // Stop replaying a macro
  stopReplay(request: StopReplayRequest): Promise<StatusResponse> {
    return new Promise((resolve, reject) => {
      this.client.StopReplay(request, (error, response) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
          return;
        }
        if (!response) {
          // 여기서 undefined 처리
          console.error('No response received');
          reject(new Error('No response received'));
          return;
        }
        console.log('Response:', response);
        resolve(response);
      });
    });
  }

  listSaveFiles(request: ListRequest, callback: (error: grpc.ServiceError | null, response: SaveFilesResponse | null) => void) {
    this.client.ListSaveFiles(request, (error, response) => {
      if (error) {
        console.error('Error in ListSaveFiles:', error);
        callback(error, null);
        return;
      }
  
      if (response === undefined) {
        // grpc.ServiceError 타입에 맞는 에러 객체 생성
        const serviceError: grpc.ServiceError = {
          name: 'NoResponseError',
          message: 'No response received',
          code: grpc.status.UNKNOWN,
          details: 'No response received from gRPC service',
          metadata: new grpc.Metadata()
        };
        console.error('No response received');
        callback(serviceError, null);
        return;
      }
  
      console.log('Response from ListSaveFiles:', response);
      callback(null, response);
    });
  }  
  getMacroDetail(request: GetMacroDetailRequest): Promise<GetMacroDetailResponse> {
    return new Promise((resolve, reject) => {
      this.client.GetMacroDetail(request, (error, response) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
          return;
        }
        if (response) {
          resolve(response);
        }
      });
    });
  }
  startComplexReplay(request: ComplexReplayRequest): Promise<StatusResponse> {
    return new Promise((resolve, reject) => {
      this.client.StartComplexReplay(request, (error, response) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
          return;
        }
        if (response) {
          resolve(response);
        }
      });
    });
  }
}

export default new MacroGrpcClient();
