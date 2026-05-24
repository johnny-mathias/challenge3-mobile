export type SettingType = 'select' | 'boolean';

export interface Setting {
  id: string;
  name: string;
  type: SettingType;
  values?: string[];
  default: string | boolean;
}