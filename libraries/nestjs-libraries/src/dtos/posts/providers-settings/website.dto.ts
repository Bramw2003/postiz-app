import { IsDefined, IsOptional, IsString, MinLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class WebsiteDto {
  @IsString()
  @MinLength(2)
  @IsDefined()
  title: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Short summary, websites may generate one from the content when empty',
  })
  summary?: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Title in the second language of the website',
  })
  translated_title?: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Summary in the second language of the website',
  })
  translated_summary?: string;
}
