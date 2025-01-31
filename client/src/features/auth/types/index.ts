export type AuthUser = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  phone_number: string;
  profileImage: string;
  telegram_id: string;
  username?: string | null;
  rule: string;
  referralPostCount: string;
  referralTotalCount: string;
};

export type UserResponse = {
  accessToken: string;
  user: AuthUser;
};
