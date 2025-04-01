import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
