import { Schema, model, Document } from 'mongoose';

export interface ISettings extends Document {
  googleTagManagerId?: string;
  customJs?: string;
  customCss?: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  theme: string;
  caching: boolean;
}

const SettingsSchema = new Schema<ISettings>({
  googleTagManagerId: {
    type: String,
    trim: true,
  },
  customJs: {
    type: String,
  },
  customCss: {
    type: String,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  userRegistration: {
    type: Boolean,
    default: true,
  },
  theme: {
    type: String,
    default: 'default',
  },
  caching: {
    type: Boolean,
    default: false,
  },
});

const Settings = model<ISettings>('Settings', SettingsSchema);

export default Settings;
