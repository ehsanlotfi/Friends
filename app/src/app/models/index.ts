export type ThemeMode = 'auto' | 'dark' | 'light';
export type SizeMode = '14px' | '16px' | '18px';
export type CEFRMode = '1' | '2' | '3' | '4' | '5' | '6';
export interface ISetting
{
    cefr: CEFRMode;
    fontSize: SizeMode;
    theme: ThemeMode;
}

export * from "./episode.model";
export * from "./quote.model";
export * from "./season.model";