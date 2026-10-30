'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { Input } from '@gitroom/react/form/input';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { WebsiteDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/website.dto';

const WebsiteSettings: FC = () => {
  const form = useSettings();
  return (
    <>
      <Input label="Title" {...form.register('title')} />
      <Input label="Summary (optional)" {...form.register('summary')} />
      <Input
        label="Translated title (optional)"
        {...form.register('translated_title')}
      />
      <Input
        label="Translated summary (optional)"
        {...form.register('translated_summary')}
      />
    </>
  );
};

export default withProvider({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  SettingsComponent: WebsiteSettings,
  CustomPreviewComponent: undefined,
  dto: WebsiteDto,
  maximumCharacters: 100000,
});
