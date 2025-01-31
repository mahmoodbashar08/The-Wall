export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  telegram_id: string;
  email: string;
  fullName: string;
  phone_number: string;
  rule: any;
  first_name?: string;
  last_name?: string;
  username?: string;
}
