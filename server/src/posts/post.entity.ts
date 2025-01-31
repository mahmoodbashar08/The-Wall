import { User } from 'src/user/user.entity';
import { Like } from 'src/likes/like.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content', type: 'varchar', length: 255 })
  content: string;

  @Column({ name: 'likeCount', type: 'int', default: 0 })
  likeCount: number;

  // If target_user_id is provided, the post will be shown on that user's wall
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'target_user_id' }) // Make sure the column name matches the one in your database
  targetUser: User;

  // Link to the creator/author of the post
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'creator_user_id' }) // This will link the post to the author
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @CreateDateColumn({ name: 'created_at' }) // Add the createdAt column
  createdAt: Date; // Automatically sets the date when a post is created
}
