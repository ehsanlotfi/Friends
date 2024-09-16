import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { FilesystemPlugin, Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, map, mergeMap } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class SQLiteService
{
    private database = "subtitle.db";
    private readonly = false;
    private version = 1;
    private transaction = false;
    private encrypted = false;

    private async copyDB()
    {
        // بررسی می‌کنیم که آیا قبلاً دیتابیس کپی شده است یا خیر
        const { value } = await Preferences.get({ key: 'dbCopied' });

        if (value === 'true')
        {
            // اگر قبلاً کپی شده است، عملیات را متوقف می‌کنیم
            console.log('Database has already been copied.');
            return;
        }

        // دیتابیس را کپی می‌کنیم
        const uri = await Filesystem.getUri({
            directory: Directory.Data,
            path: this.database,
        });

        await CapacitorSQLite.copyFromAssets({});

        // بعد از کپی دیتابیس، فلگ را به true تنظیم می‌کنیم
        await Preferences.set({ key: 'dbCopied', value: 'true' });
        console.log('Database copied successfully.');
    }

    private async createConnection()
    {
        return await CapacitorSQLite.createConnection({
            database: this.database,
            version: this.version,
            encrypted: this.encrypted,
        });
    }

    private async isOpen()
    {
        return await CapacitorSQLite.isDBOpen({
            database: this.database
        })
    }

    public async initDataBase()
    {
        if (Capacitor.isNativePlatform())
        {
            await this.copyDB();

            try
            {
                await this.createConnection()
            } catch { }

        }

    }

    private async openConnection()
    {
        if (!((await this.isOpen()).result))
        {
            await CapacitorSQLite.open({
                database: this.database,
                readonly: this.readonly
            })
        }

    }

    private async closeConnection()
    {
        await CapacitorSQLite.close({
            database: this.database,
            readonly: this.readonly
        })
    }

    public async excute(query: string)
    {

        await this.openConnection();

        await CapacitorSQLite.execute({
            database: this.database,
            statements: query,
            readonly: this.readonly,
            transaction: this.transaction
        })

        await this.closeConnection();
    }

    public excuteObservable(query: string): Observable<capSQLiteChanges>
    {
        return from(this.openConnection()).pipe(mergeMap(open =>
        {
            const param = {
                database: this.database,
                statements: query,
                readonly: this.readonly,
                transaction: this.transaction
            };
            return from(CapacitorSQLite.execute(param)).pipe(map(result =>
            {
                from(this.closeConnection());
                return result;
            }))
        }));
    }

    public async query<T>(query: string)
    {
        await this.openConnection();

        const result = await CapacitorSQLite.query({
            database: this.database,
            statement: query,
            readonly: this.readonly,
            values: []
        });

        await this.closeConnection();

        return result.values as T[];
    }

    public queryObservable<T>(query: string): Observable<T[]>
    {
        return from(this.openConnection()).pipe(mergeMap(open =>
        {
            const param = {
                database: this.database,
                statement: query,
                readonly: this.readonly,
                values: []
            };
            return from(CapacitorSQLite.query(param)).pipe(map(result =>
            {
                from(this.closeConnection());
                return result.values as T[];
            }))
        }));
    }

}