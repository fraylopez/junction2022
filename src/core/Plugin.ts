export interface Plugin<TData = unknown> {
  name: string;
  register(): Promise<void>;
  setupPrivacy(privacy: Privacy): Promise<void>;
  authorize(): Promise<void>;
  sync(): Promise<SyncResponse<TData>>;
}

interface Cursor<TData> { }

export interface SyncResponse<TData> {
  cursor?: Cursor<TData>;
  data: TData;
}

export enum Privacy {
  Demographic = "demographic",
  PersonalIdentifiableInformation = "pii",
}