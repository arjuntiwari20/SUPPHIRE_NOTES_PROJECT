import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiPropertyOptional({
    example: 'Updated Title',
    description: 'New title for the note (if changing)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated description after discussion.',
    description: 'New description for the note (if changing)',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
