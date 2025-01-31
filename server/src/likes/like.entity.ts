import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Post } from 'src/posts/post.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn({ name: 'likeId', type: 'int' })
  id: number;

  // Foreign key to the user who liked the post
  @Column({ name: 'user_iduser', type: 'int' })
  userId: number;

  // Foreign key to the post being liked
  @Column({ name: 'posts_postId', type: 'int' })
  postId: number;

  // Relation with the User entity (the user who liked the post)
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_iduser' })
  user: User;

  // Relation with the Post entity (the post being liked)
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'posts_postId' })
  post: Post;
}
