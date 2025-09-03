export type UUID = string;

export type AuditAction = 'included' | 'excluded' | 'modified' | 'type_changed';

export interface AuditActor {
  id?: string;
  name?: string;
}

export interface AuditOptions {
  displayNameMap?: Record<string, string>;
  ignorePaths?: string[];
  arrayIdentity?: Record<string, string[]>;
  nullPolicy?: 'null_is_value' | 'null_equals_absent';
  numberEpsilon?: number;
  trackReorder?: boolean;
}

export interface AuditInput {
  id: UUID;
  name: string;
  before: unknown;
  after: unknown;
  actor?: AuditActor;
  options?: AuditOptions;
}

export interface AuditEvent {
  path: string;
  field: string;
  displayName: string;
  action: AuditAction;
  old: unknown | null;
  new: unknown | null;
}

export interface AuditSummary {
  included: number;
  excluded: number;
  modified: number;
  type_changed: number;
  total: number;
}

export interface AuditOutput {
  id: UUID;
  auditId: string;
  timestamp: string;
  actor?: AuditActor;
  name: string;
  summary: AuditSummary;
  events: AuditEvent[];
}
