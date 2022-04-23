import { Access, Branch, Invite, Language, Project, Right, Role, TokenResponse, UserResponse } from '../../client';

export interface InviteProps {
  item: Invite;
  remove(): void;
  resend(): void;
}

export interface ProjectProps {
  item: Project;
  remove(): void;
}

export interface ItemProps<T> {
  item: T;
  refresh(): void;
}

export interface BranchProps {
  item: Branch;
  refresh(): void;
}

export interface TokenProps {
  item: TokenResponse;
  remove(): void;
}

export interface AccessProps {
  item: Access;
  refresh(): void;
}

export interface RoleProps {
  item: Role;
  refresh(): void;
}

export interface RightProps {
  item: Right;
  selected: boolean;
  setSelected(value: boolean): void;
}

export interface UserProps {
  item: UserResponse;
  remove(): void;
}