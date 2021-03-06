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

export class ProcessIdentity extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTask(): string;
  setTask(value: string): void;

  getSubtask(): string;
  setSubtask(value: string): void;

  getType(): string;
  setType(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getSubprocess(): boolean;
  setSubprocess(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessIdentity.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessIdentity): ProcessIdentity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProcessIdentity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessIdentity;
  static deserializeBinaryFromReader(message: ProcessIdentity, reader: jspb.BinaryReader): ProcessIdentity;
}

export namespace ProcessIdentity {
  export type AsObject = {
    id: string,
    task: string,
    subtask: string,
    type: string,
    version: string,
    subprocess: boolean,
  }
}

export class ProcessInput extends jspb.Message {
  getInput(): string;
  setInput(value: string): void;

  getType(): string;
  setType(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  hasCaller(): boolean;
  clearCaller(): void;
  getCaller(): ProcessIdentity | undefined;
  setCaller(value?: ProcessIdentity): void;

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
    input: string,
    type: string,
    version: string,
    caller?: ProcessIdentity.AsObject,
  }
}

export class ProcessExternalResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): void;

  getOutput(): string;
  setOutput(value: string): void;

  hasCaller(): boolean;
  clearCaller(): void;
  getCaller(): ProcessIdentity | undefined;
  setCaller(value?: ProcessIdentity): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessExternalResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessExternalResponse): ProcessExternalResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProcessExternalResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessExternalResponse;
  static deserializeBinaryFromReader(message: ProcessExternalResponse, reader: jspb.BinaryReader): ProcessExternalResponse;
}

export namespace ProcessExternalResponse {
  export type AsObject = {
    status: string,
    output: string,
    caller?: ProcessIdentity.AsObject,
  }
}

export class ProcessError extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  getStack(): string;
  setStack(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessError.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessError): ProcessError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProcessError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessError;
  static deserializeBinaryFromReader(message: ProcessError, reader: jspb.BinaryReader): ProcessError;
}

export namespace ProcessError {
  export type AsObject = {
    name: string,
    message: string,
    stack: string,
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

  getCurrentInput(): string;
  setCurrentInput(value: string): void;

  getNextDeployTime(): number;
  setNextDeployTime(value: number): void;

  getNextTask(): string;
  setNextTask(value: string): void;

  getNextSubtask(): string;
  setNextSubtask(value: string): void;

  getTaskState(): string;
  setTaskState(value: string): void;

  getState(): string;
  setState(value: string): void;

  getInput(): string;
  setInput(value: string): void;

  getOutput(): string;
  setOutput(value: string): void;

  hasError(): boolean;
  clearError(): void;
  getError(): ProcessError | undefined;
  setError(value?: ProcessError): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getActive(): boolean;
  setActive(value: boolean): void;

  hasCaller(): boolean;
  clearCaller(): void;
  getCaller(): ProcessIdentity | undefined;
  setCaller(value?: ProcessIdentity): void;

  clearActionsList(): void;
  getActionsList(): Array<ExternalAction>;
  setActionsList(value: Array<ExternalAction>): void;
  addActions(value?: ExternalAction, index?: number): ExternalAction;

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
    currentInput: string,
    nextDeployTime: number,
    nextTask: string,
    nextSubtask: string,
    taskState: string,
    state: string,
    input: string,
    output: string,
    error?: ProcessError.AsObject,
    tagsList: Array<string>,
    active: boolean,
    caller?: ProcessIdentity.AsObject,
    actionsList: Array<ExternalAction.AsObject>,
  }
}

export class ExternalAction extends jspb.Message {
  hasProcessStart(): boolean;
  clearProcessStart(): void;
  getProcessStart(): ProcessInput | undefined;
  setProcessStart(value?: ProcessInput): void;

  hasProcessResponse(): boolean;
  clearProcessResponse(): void;
  getProcessResponse(): ProcessExternalResponse | undefined;
  setProcessResponse(value?: ProcessExternalResponse): void;

  getActionCase(): ExternalAction.ActionCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExternalAction.AsObject;
  static toObject(includeInstance: boolean, msg: ExternalAction): ExternalAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExternalAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExternalAction;
  static deserializeBinaryFromReader(message: ExternalAction, reader: jspb.BinaryReader): ExternalAction;
}

export namespace ExternalAction {
  export type AsObject = {
    processStart?: ProcessInput.AsObject,
    processResponse?: ProcessExternalResponse.AsObject,
  }

  export enum ActionCase {
    ACTION_NOT_SET = 0,
    PROCESS_START = 1,
    PROCESS_RESPONSE = 2,
  }
}

export class Processes extends jspb.Message {
  clearProcessesList(): void;
  getProcessesList(): Array<Process>;
  setProcessesList(value: Array<Process>): void;
  addProcesses(value?: Process, index?: number): Process;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Processes.AsObject;
  static toObject(includeInstance: boolean, msg: Processes): Processes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Processes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Processes;
  static deserializeBinaryFromReader(message: Processes, reader: jspb.BinaryReader): Processes;
}

export namespace Processes {
  export type AsObject = {
    processesList: Array<Process.AsObject>,
  }
}

export class ProcessId extends jspb.Message {
  getProcessid(): string;
  setProcessid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessId.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessId): ProcessId.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProcessId, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessId;
  static deserializeBinaryFromReader(message: ProcessId, reader: jspb.BinaryReader): ProcessId;
}

export namespace ProcessId {
  export type AsObject = {
    processid: string,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

