import { Injectable } from '@nestjs/common';
import { messages, SupportedLocale } from '../constants/messages';

type Messages = typeof messages;
type SectionKey = keyof Messages[SupportedLocale];
type MessageKey<T extends SectionKey> = keyof Messages[SupportedLocale][T];

@Injectable()
export class TranslationService {
  translate<TSection extends SectionKey, TKey extends MessageKey<TSection>>(
    locale: string | undefined,
    section: TSection,
    key: TKey,
  ): Messages[SupportedLocale][TSection][TKey] {
    const normalized = (locale?.split('-')[0] ?? 'fr').toLowerCase();
    const fallback: SupportedLocale = normalized === 'en' ? 'en' : 'fr';
    const dictionary = messages[fallback];
    return dictionary[section][key];
  }
}
