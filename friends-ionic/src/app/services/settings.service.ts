import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISetting, ThemeMode } from '../models';
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root',
})
export class SettingsService
{
    /**
     * Variable that controls the user interface. Used to toggle 'dark-theme' class.
     */
    public darkMode$ = new BehaviorSubject<boolean>(false);

    // Check user preference for light/dark theme
    private prefDark = window.matchMedia('(prefers-color-scheme: dark)');

    constructor()
    {
        // Set user preferred mode on refresh.
        this.setMode(this.getMode());

        // Change between light/dark theme based on device settings
        if (this.getMode() === 'auto')
        {
            this.darkMode$.next(this.prefDark.matches);
            this.listenToThemeModeChanges();
        }
    }

    private applyThemeModeChanges = (event: any) =>
    {
        this.darkMode$.next(event.matches);
    }

    private listenToThemeModeChanges()
    {
        this.prefDark.addEventListener('change', this.applyThemeModeChanges);
    }

    private removeThemeModeChangesListener()
    {
        this.prefDark.removeEventListener('change', this.applyThemeModeChanges);
    }

    /**
     * Set user preferred color mode.
     */
    setMode = (ThemeMode: ThemeMode) =>
    {
        localStorage.setItem('mode', ThemeMode);

        switch (ThemeMode)
        {
            case 'auto':
                this.darkMode$.next(this.prefDark.matches);
                this.listenToThemeModeChanges();
                break;

            case 'dark':
                this.darkMode$.next(true);
                this.removeThemeModeChangesListener();
                break;

            case 'light':
                this.darkMode$.next(false);
                this.removeThemeModeChangesListener();
                break;

            default:
                break;
        }
    };

    /**
     * Get user preferred color mode.
     */
    getMode = (): ThemeMode =>
    {
        // Get user preferred mode from localStorage and if not set return default
        return localStorage.getItem('mode') as ThemeMode ?? 'auto';
    }

    async setSettings(Settings: ISetting | null)
    {
        if (!Settings)
        {
            Settings = {
                cefr: "1",
                fontSize: "16px",
                theme: "auto"
            }
        }

        await Preferences.set({
            key: 'settings', value: JSON.stringify(Settings)
        });

        this.setMode(Settings.theme);
        document.documentElement.style.setProperty('--font-size', Settings.fontSize);
    }
}