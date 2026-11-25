export type Role = string;
export type Permission =
  | "settings:read"
  | "settings:manage"
  | "users:read"
  | "users:manage"
  | "audit:read"
  | "roles:manage";
export interface User {
  id: string;
  email: string;
  name: string;
  timeZone: string;
  emailConfirmed: boolean;
  role: Role;
  roleName: string;
  permissions: Permission[];
}
export interface RoleDefinition {
  id: Role;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
}
export interface PermissionDefinition {
  id: Permission;
  group: string;
  label: string;
  description: string;
  requires: Permission[];
}
export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleName: string;
  active: boolean;
  canManage: boolean;
  emailConfirmed: boolean;
}
export interface CompanySettings {
  name: string;
  timeZone: string;
  logoUrl: string | null;
}
export interface CoordinatedService {
  id: string;
  name: string;
  modality: "in_person" | "virtual";
  description: string;
}
export interface AuditEvent {
  id: string;
  action: string;
  targetId: string | null;
  createdAt: string;
  actorName: string;
}
export interface Session {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  current: boolean;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export interface RoleOption {
  id: string;
  name: string;
  canAssign: boolean;
}
