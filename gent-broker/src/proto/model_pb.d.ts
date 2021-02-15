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

export class ProcessInput extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getCaller(): string;
  setCaller(value: string): void;

  getInput(): string;
  setInput(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessInput.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessInput): ProcessInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProcessInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessInput;
  static deserializeBinaryFromReader(message: ProcessInput, reader: jspb.BinaryReader): ProcessInput;
}

export namespace ProcessInput {
  export type AsObject = {
    type: string,
    version: string,
    caller: string,
    input: string,
  }
}

export class Process extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getCreated(): number;
  setCreated(value: number): void;

  getType(): string;
  setType(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getCurrentTask(): string;
  setCurrentTask(value: string): void;

  getCurrentSubtask(): string;
  setCurrentSubtask(value: string): void;

  getCurrentState(): string;
  setCurrentState(value: string): void;

  getCurrentInput(): string;
  setCurrentInput(value: string): void;

  getCurrentDeployTime(): number;
  setCurrentDeployTime(value: number): void;

  getState(): string;
  setState(value: string): void;

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

  getActive(): boolean;
  setActive(value: boolean): void;

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
    created: number,
    type: string,
    version: string,
    status: string,
    currentTask: string,
    currentSubtask: string,
    currentState: string,
    currentInput: string,
    currentDeployTime: number,
    state: string,
    input: string,
    output: string,
    error: string,
    tagsList: Array<string>,
    active: boolean,
  }
}

export class WorkerIn extends jspb.Message {
  hasRegisterWorker(): boolean;
  clearRegisterWorker(): void;
  getRegisterWorker(): Worker | undefined;
  setRegisterWorker(value?: Worker): void;

  hasCreateProcess(): boolean;
  clearCreateProcess(): void;
  getCreateProcess(): Process | undefined;
  setCreateProcess(value?: Process): void;

  hasStepResult(): boolean;
  clearStepResult(): void;
  getStepResult(): Process | undefined;
  setStepResult(value?: Process): void;

  getDataCase(): WorkerIn.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkerIn.AsObject;
  static toObject(includeInstance: boolean, msg: WorkerIn): WorkerIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkerIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkerIn;
  static deserializeBinaryFromReader(message: WorkerIn, reader: jspb.BinaryReader): WorkerIn;
}

export namespace WorkerIn {
  export type AsObject = {
    registerWorker?: Worker.AsObject,
    createProcess?: Process.AsObject,
    stepResult?: Process.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    REGISTER_WORKER = 1,
    CREATE_PROCESS = 2,
    STEP_RESULT = 3,
  }
}

export class WorkerOut extends jspb.Message {
  hasValidateInput(): boolean;
  clearValidateInput(): void;
  getValidateInput(): ProcessInput | undefined;
  setValidateInput(value?: ProcessInput): void;

  hasMakeStep(): boolean;
  clearMakeStep(): void;
  getMakeStep(): Process | undefined;
  setMakeStep(value?: Process): void;

  getDataCase(): WorkerOut.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkerOut.AsObject;
  static toObject(includeInstance: boolean, msg: WorkerOut): WorkerOut.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkerOut, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkerOut;
  static deserializeBinaryFromReader(message: WorkerOut, reader: jspb.BinaryReader): WorkerOut;
}

export namespace WorkerOut {
  export type AsObject = {
    validateInput?: ProcessInput.AsObject,
    makeStep?: Process.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    VALIDATE_INPUT = 1,
    MAKE_STEP = 2,
  }
}

