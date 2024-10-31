import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root',
})
export class EntryGuard implements CanActivate
{
    constructor(private router: Router) { }

    async canActivate(): Promise<boolean>
    {
        const { value } = await Preferences.get({ key: 'firstVisit' });

        if (value == 'true')
        {
            this.router.navigate(['/app']);
            return false;
        } else
        {
            await Preferences.set({ key: 'firstVisit', value: 'true' });
            this.router.navigate(['/splash']);
            return false;
        }

    }
}
