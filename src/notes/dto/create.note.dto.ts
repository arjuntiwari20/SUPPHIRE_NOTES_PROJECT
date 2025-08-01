import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @IsString()
  @ApiProperty({
    example: 'Meeting Notes',
    description: 'Title of the note',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'Discussed project roadmap and next steps.',
    description: 'Detailed description of the note',
  })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'User ID of the note creator (optional if using JWT)',
  })
  userId: number;
}
