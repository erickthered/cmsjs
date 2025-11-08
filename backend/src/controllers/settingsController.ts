import { Request, Response, NextFunction } from 'express';
import Settings from '../models/Settings';

// Get site settings (Admin only)
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // If no settings exist, create a default one
      settings = new Settings({});
      await settings.save();
    }

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// Update site settings (Admin only)
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  const {
    googleTagManagerId,
    customJs,
    customCss,
    maintenanceMode,
    userRegistration,
    theme,
    caching,
  } = req.body;

  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // If no settings exist, create a default one
      settings = new Settings({});
    }

    settings.googleTagManagerId = googleTagManagerId !== undefined ? googleTagManagerId : settings.googleTagManagerId;
    settings.customJs = customJs !== undefined ? customJs : settings.customJs;
    settings.customCss = customCss !== undefined ? customCss : settings.customCss;
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;
    settings.userRegistration = userRegistration !== undefined ? userRegistration : settings.userRegistration;
    settings.theme = theme || settings.theme;
    settings.caching = caching !== undefined ? caching : settings.caching;

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
};
