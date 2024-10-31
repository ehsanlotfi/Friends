import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
@Injectable({
    providedIn: "root"
})
export class InitializeAppService
{
    constructor(
        private sqliteService: SQLiteService
    ) { }

    async initializeApp()
    {
        await this.sqliteService.initDataBase();
    }

}