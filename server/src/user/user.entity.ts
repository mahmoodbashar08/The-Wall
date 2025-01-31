import { Like } from 'src/likes/like.entity';
import { Post } from 'src/posts/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'userId', type: 'int' })
  id: number;

  @PrimaryColumn({ name: 'telegramId', type: 'varchar', length: 45 })
  telegramId: string;

  @Column({ name: 'username', type: 'varchar', length: 45, nullable: true })
  username?: string;

  @Column({ name: 'firstName', type: 'varchar', length: 45, nullable: true })
  firstName?: string;

  @Column({ name: 'lastName', type: 'varchar', length: 45, nullable: true })
  lastName?: string;

  @Column({ name: 'referralBy', type: 'varchar', length: 45, nullable: true })
  referralBy?: string;

  @Column({
    name: 'profileImage',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profileImage?: string;

  @Column({
    name: 'referralTotalCount',
    type: 'varchar',
    length: 45,
    default: '0', // Default value
  })
  referralTotalCount: string;

  @Column({
    name: 'referralPostCount',
    type: 'varchar',
    length: 45,
    default: '0', // Default value
  })
  referralPostCount: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
