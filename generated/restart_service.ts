/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: restart_service.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export class RestartRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): RestartRequest {
        const message = new RestartRequest({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RestartRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new RestartRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): RestartRequest {
        return RestartRequest.deserialize(bytes);
    }
}
export class RestartResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        message?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
        }
    }
    get message() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set message(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    static fromObject(data: {
        message?: string;
    }): RestartResponse {
        const message = new RestartResponse({});
        if (data.message != null) {
            message.message = data.message;
        }
        return message;
    }
    toObject() {
        const data: {
            message?: string;
        } = {};
        if (this.message != null) {
            data.message = this.message;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.message.length)
            writer.writeString(1, this.message);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RestartResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new RestartResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.message = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): RestartResponse {
        return RestartResponse.deserialize(bytes);
    }
}
export class UpdateRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): UpdateRequest {
        const message = new UpdateRequest({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): UpdateRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new UpdateRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): UpdateRequest {
        return UpdateRequest.deserialize(bytes);
    }
}
export class UpdateResponse extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        progress?: number;
        status_message?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("progress" in data && data.progress != undefined) {
                this.progress = data.progress;
            }
            if ("status_message" in data && data.status_message != undefined) {
                this.status_message = data.status_message;
            }
        }
    }
    get progress() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set progress(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get status_message() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set status_message(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        progress?: number;
        status_message?: string;
    }): UpdateResponse {
        const message = new UpdateResponse({});
        if (data.progress != null) {
            message.progress = data.progress;
        }
        if (data.status_message != null) {
            message.status_message = data.status_message;
        }
        return message;
    }
    toObject() {
        const data: {
            progress?: number;
            status_message?: string;
        } = {};
        if (this.progress != null) {
            data.progress = this.progress;
        }
        if (this.status_message != null) {
            data.status_message = this.status_message;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.progress != 0)
            writer.writeInt32(1, this.progress);
        if (this.status_message.length)
            writer.writeString(2, this.status_message);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): UpdateResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new UpdateResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.progress = reader.readInt32();
                    break;
                case 2:
                    message.status_message = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): UpdateResponse {
        return UpdateResponse.deserialize(bytes);
    }
}
interface GrpcUnaryServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
}
interface GrpcStreamServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
    (message: P, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
}
interface GrpWritableServiceInterface<P, R> {
    (metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
}
interface GrpcChunkServiceInterface<P, R> {
    (metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
    (options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
}
interface GrpcPromiseServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<R>;
    (message: P, options?: grpc_1.CallOptions): Promise<R>;
}
export abstract class UnimplementedRestartService {
    static definition = {
        RestartProcess: {
            path: "/Restart/RestartProcess",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: RestartRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => RestartRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: RestartResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => RestartResponse.deserialize(new Uint8Array(bytes))
        },
        RequestUpdate: {
            path: "/Restart/RequestUpdate",
            requestStream: false,
            responseStream: true,
            requestSerialize: (message: UpdateRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => UpdateRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: UpdateResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => UpdateResponse.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract RestartProcess(call: grpc_1.ServerUnaryCall<RestartRequest, RestartResponse>, callback: grpc_1.sendUnaryData<RestartResponse>): void;
    abstract RequestUpdate(call: grpc_1.ServerWritableStream<UpdateRequest, UpdateResponse>): void;
}
export class RestartClient extends grpc_1.makeGenericClientConstructor(UnimplementedRestartService.definition, "Restart", {}) {
    constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
        super(address, credentials, options);
    }
    RestartProcess: GrpcUnaryServiceInterface<RestartRequest, RestartResponse> = (message: RestartRequest, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<RestartResponse>, options?: grpc_1.CallOptions | grpc_1.requestCallback<RestartResponse>, callback?: grpc_1.requestCallback<RestartResponse>): grpc_1.ClientUnaryCall => {
        return super.RestartProcess(message, metadata, options, callback);
    };
    RequestUpdate: GrpcStreamServiceInterface<UpdateRequest, UpdateResponse> = (message: UpdateRequest, metadata?: grpc_1.Metadata | grpc_1.CallOptions, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<UpdateResponse> => {
        return super.RequestUpdate(message, metadata, options);
    };
}
