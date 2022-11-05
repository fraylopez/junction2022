import { PartialNested } from "../utils/PartialNested";

export interface Plugin<TData = unknown> {
  name: string;
  register(): Promise<void>;
  setupPrivacy(privacy: Privacy): void;
  authorize(): Promise<void>;
  sync(cursor?: Cursor): Promise<SyncResponse<TData>>;
}

interface Cursor { }

export interface SyncResponse<TData> {
  cursor?: Cursor;
  data: PartialNested<TData>;
}

export enum Privacy {
  Demographic = "demographic",
  PersonalIdentifiableInformation = "pii",
}