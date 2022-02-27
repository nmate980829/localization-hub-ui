import { Invite } from '../axiosClient';

export interface PageHeaderProps {
  title: string;
  refresh?(): void;
  create?(): void;
}

export interface ConfirmProps {
  title: string;
  description: string;
  actionName: string;
  isOpen: boolean;
  onClose(): void;
  action(): void;
}