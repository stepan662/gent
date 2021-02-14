// package: 
// file: model.proto

import * as jspb from "google-protobuf";

export class Worker extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Worker.AsObject;
  static toObject(includeInstance: boolean, msg: Worker): Worker.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Worker, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Worker;
  static deserializeBinaryFromReader(message: Worker, reader: jspb.BinaryReader): Worker;
}

export namespace Worker {
  export type AsObject = {
    type: string,
    version: string,
  }
}

export class Event extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getSubtask(): string;
  setSubtask(value: string): void;

  getCreaded(): number;
  setCreaded(value: number): void;

  getDeployTime(): number;
  setDeployTime(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    id: string,
    subtask: string,
    creaded: number,
    deployTime: number,
    data: string,
  }
}

export class Process extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getType(): string;
  setType(value: string): void;

  getStatus(): ProcessStatusMap[keyof ProcessStatusMap];
  setStatus(value: ProcessStatusMap[keyof ProcessStatusMap]): void;

  getCurrentTask(): string;
  setCurrentTask(value: string): void;

  getCurrentState(): string;
  setCurrentState(value: string): void;

  getCurrentSubtask(): string;
  setCurrentSubtask(value: string): void;

  getGlobalState(): string;
  setGlobalState(value: string): void;

  getInput(): string;
  setInput(value: string): void;

  getOutput(): string;
  setOutput(value: string): void;

  getError(): string;
  setError(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Process.AsObject;
  static toObject(includeInstance: boolean, msg: Process): Process.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Process, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Process;
  static deserializeBinaryFromReader(message: Process, reader: jspb.BinaryReader): Process;
}

export namespace Process {
  export type AsObject = {
    id: string,
    type: string,
    status: ProcessStatusMap[keyof ProcessStatusMap],
    currentTask: string,
    currentState: string,
    currentSubtask: string,
    globalState: string,
    input: string,
    output: string,
    error: string,
    tagsList: Array<string>,
  }
}

export class WorkerMessage extends jspb.Message {
  hasWorker(): boolean;
  clearWorker(): void;
  getWorker(): Worker | undefined;
  setWorker(value?: Worker): void;

  hasEvent(): boolean;
  clearEvent(): void;
  getEvent(): Event | undefined;
  setEvent(value?: Event): void;

  hasProcess(): boolean;
  clearProcess(): void;
  getProcess(): Process | undefined;
  setProcess(value?: Process): void;

  getDataCase(): WorkerMessage.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkerMessage.AsObject;
  static toObject(includeInstance: boolean, msg: WorkerMessage): WorkerMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkerMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkerMessage;
  static deserializeBinaryFromReader(message: WorkerMessage, reader: jspb.BinaryReader): WorkerMessage;
}

export namespace WorkerMessage {
  export type AsObject = {
    worker?: Worker.AsObject,
    event?: Event.AsObject,
    process?: Process.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    WORKER = 1,
    EVENT = 2,
    PROCESS = 3,
  }
}

export interface ProcessStatusMap {
  RUNNING: 0;
  WAITING: 1;
  FINISHED: 2;
  ERROR: 3;
}

export const ProcessStatus: ProcessStatusMap;

