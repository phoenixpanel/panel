import { action, Action } from 'easy-peasy';

export interface SiteSettings {
  name: string;
  locale: string;
  captcha: {
    provider: string;
    siteKey: string;
  };
}

export interface SettingsStore {
  data?: SiteSettings;
  setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
  data: undefined,

  setSettings: action((state, payload) => {
    state.data = payload;
  }),
};

export default settings;
