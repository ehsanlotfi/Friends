import { Injectable } from '@angular/core';
import * as _mod from 'src/app/models';
import { Capacitor } from '@capacitor/core';
import { SQLiteService } from './sqlite.service';
import { Observable, map, of } from 'rxjs';
import { fakeData } from './fake-data';
import { seasonsData } from './season.data';
import { capSQLiteChanges } from '@capacitor-community/sqlite';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class GlobalService
{

  seasons = seasonsData;

  constructor(private readonly _sqlite: SQLiteService, private toastController: ToastController) { }

  async toast(message: string, duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'bottom')
  {
    const toast = await this.toastController.create({
      message,
      duration,
      position
    });
    await toast.present();
  }

  getAllSeasons(): _mod.Season[]
  {
    return this.seasons.map(({ episodes, ...rest }) => rest);
  }

  getAllEpisode(seasonId: number): _mod.Season[]
  {
    return this.seasons.filter(f => f.number == seasonId);
  }

  async getAllQuote(seasonId: number, episodeId: number): Promise<Observable<_mod.Quote[]>>
  {
    if (Capacitor.isNativePlatform())
    {
      let level = "1";
      const { value } = await Preferences.get({ key: 'settings' });
      if (value)
      {
        level = (JSON.parse(value) as _mod.ISetting).cefr;
      }
      return this._sqlite.queryObservable<_mod.Quote>(`SELECT  * FROM Translates Where Season = ${seasonId} AND Capture = ${episodeId} AND level >= ${level}`);
    } else
    {
      return of(fakeData);
    }
  }

  setLeitnerCard(id: number): Observable<capSQLiteChanges>
  {
    const query = `UPDATE Translates SET TYPE = 2, DateSeen = strftime('%s', 'now'), CntSeen = 1 WHERE ID = ${id}`;

    if (Capacitor.isNativePlatform())
    {
      return this._sqlite.excuteObservable(query);
    } else
    {
      return of();
    }
  }

  getCards(): Observable<_mod.Quote[]>
  {
    const query = `SELECT  * FROM Translates WHERE
      (DateSeen > strftime('%s', 'now', '-7 days') AND Type = 0 AND CntSeen < 4) OR
      (DateSeen > strftime('%s', 'now', '-3 days') AND Type = 1) OR
      (DateSeen > strftime('%s', 'now', '-1 days') AND Type = 2)`;

    if (Capacitor.isNativePlatform())
    {
      return this._sqlite.queryObservable<_mod.Quote>(query).pipe(map(data =>
      {
        data.forEach(item => item.showTrans = false);
        return data;
      }));
    } else
    {
      return of(fakeData);
    }
  }

  getStatistics(): Observable<_mod.Statistics[]>
  {
    const query = `SELECT 
                      COUNT(CASE WHEN DateSeen > strftime('%s', 'now', '-7 days') 
                                    AND Type = 0 
                                    AND CntSeen >= 4 THEN 1 END) AS Learned,
                      COUNT(CASE WHEN DateSeen > strftime('%s', 'now', '-7 days') 
                                    AND Type = 0 
                                    AND CntSeen < 4 THEN 1 END) AS LongTermMemory,
                      COUNT(CASE WHEN DateSeen > strftime('%s', 'now', '-3 days') 
                                    AND Type = 1 THEN 1 END) AS ShortTermMemory,
                      COUNT(CASE WHEN DateSeen > strftime('%s', 'now', '-1 days') 
                                    AND Type = 2 THEN 1 END) AS NeedReview
                  FROM Translates;`;

    if (Capacitor.isNativePlatform())
    {
      return this._sqlite.queryObservable<_mod.Statistics>(query).pipe(map(data =>
      {
        return data;
      }));
    } else
    {
      return of([]);
    }
  }

  setLeitnerType(id: number, type: _mod.QuoteType): Observable<boolean>
  {

    const query = type == _mod.QuoteType.EASY ?
      `UPDATE Translates SET TYPE = ${type}, DateSeen = strftime('%s', 'now'), CntSeen = CntSeen + 1 WHERE ID = ${id};` :
      `UPDATE Translates SET TYPE = ${type}, DateSeen = strftime('%s', 'now') WHERE ID = ${id};`;

    if (Capacitor.isNativePlatform())
    {
      this._sqlite.excuteObservable(query).subscribe();
      return of(true);
    } else
    {
      return of(false);
    }

  }

}