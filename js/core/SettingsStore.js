const DEFAULT_SETTINGS = {
  theme: 'railscasts',
  themeSite: 'dark-mode',
  fontSize: 16,
  autocomplete: true,
  highlightLine: true,
  clearEditor: false,
  hidePopUp: false
};

class SettingsStore {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.load();
  }

  load() {
    const saved = localStorage.getItem('settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  save() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
    this.save();
  }

  getAll() {
    return { ...this.settings };
  }

  setDefault() {
    localStorage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS));
    this.load()
  }
}

export const settingsStore = new SettingsStore();
