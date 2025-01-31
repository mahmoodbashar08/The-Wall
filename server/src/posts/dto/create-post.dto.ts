export class CreatePostDto {
  content: string;
  authorId: string; // Telegram ID of the author
  targetUserId?: string; // Telegram ID of the target user (null for global posts)
  isPaid: boolean;
}
