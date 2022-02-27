import { Invite, UserResponse } from '../../axiosClient';

export interface InviteProps {
  invite: Invite;
  remove(): void;
  resend(): void;
}

export interface UserProps {
  user: UserResponse;
  remove(): void;
}