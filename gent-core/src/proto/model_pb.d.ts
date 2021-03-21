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

export class Caller extends jspb.Message {
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

  getReply(): boolean;
  setReply(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Caller.AsObject;
  static toObject(includeInstance: boolean, msg: Caller): Caller.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Caller, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Caller;
  static deserializeBinaryFromReader(message: Caller, reader: jspb.BinaryReader): Caller;
}

export namespace Caller {
  export type AsObject = {
    id: string,
    task: string,
    subtask: string,
    type: string,
    version: string,
    reply: boolean,
  }
}

export class SubProcess extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getInput(): string;
  setInput(value: string): void;

  getType(): string;
  setType(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getTask(): string;
  setTask(value: string): void;

  getReply(): boolean;
  setReply(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubProcess.AsObject;
  static toObject(includeInstance: boolean, msg: SubProcess): SubProcess.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubProcess, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubProcess;
  static deserializeBinaryFromReader(message: SubProcess, reader: jspb.BinaryReader): SubProcess;
}

export namespace SubProcess {
  export type AsObject = {
    id: string,
    status: string,
    input: string,
    type: string,
    version: string,
    task: string,
    reply: boolean,
  }
}

export class ProcessExternalResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): void;

  getOutput(): string;
  setOutput(value: string): void;

  hasCaller(): boolean;
  clearCaller(): void;
  getCaller(): Caller | undefined;
  setCaller(value?: Caller): void;

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
    caller?: Caller.AsObject,
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

  hasCaller(): boolean;
  clearCaller(): void;
  getCaller(): Caller | undefined;
  setCaller(value?: Caller): void;

  clearSubProcessesList(): void;
  getSubProcessesList(): Array<SubProcess>;
  setSubProcessesList(value: Array<SubProcess>): void;
  addSubProcesses(value?: SubProcess, index?: number): SubProcess;

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
    caller?: Caller.AsObject,
    subProcessesList: Array<SubProcess.AsObject>,
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

export class ProcessIds extends jspb.Message {
  clearProcessidList(): void;
  getProcessidList(): Array<string>;
  setProcessidList(value: Array<string>): void;
  addProcessid(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessIds.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessIds): ProcessIds.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProcessIds, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessIds;
  static deserializeBinaryFromReader(message: ProcessIds, reader: jspb.BinaryReader): ProcessIds;
}

export namespace ProcessIds {
  export type AsObject = {
    processidList: Array<string>,
  }
}

