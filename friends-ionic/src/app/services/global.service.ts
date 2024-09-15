import { Injectable } from '@angular/core';
import * as _mod from 'src/app/models';
import { Capacitor } from '@capacitor/core';
import { SQLiteService } from './sqlite.service';
import { Observable, map, of } from 'rxjs';
import { fakeData } from './fake-data';
import { seasonsData } from './season.data';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class GlobalService
{

  seasons = seasonsData;

  constructor(private readonly _sqlite: SQLiteService) { }

  getAllSeasons(): _mod.Season[]
  {
    return this.seasons.map(({ episodes, ...rest }) => rest);
  }

  getAllEpisode(seasonId: number): _mod.Season[]
  {
    return this.seasons.filter(f => f.number == seasonId);
  }

  getAllQuote(seasonId: number, episodeId: number): Observable<_mod.Quote[]>
  {
    if (Capacitor.isNativePlatform())
    {
      return this._sqlite.queryObservable<_mod.Quote>(`SELECT  * FROM Translates Where Season = ${seasonId} AND Capture = ${episodeId}`);
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

  setLeitnerType(id: number, type: _mod.QuoteType)
  {

    const query = type == _mod.QuoteType.EASY ?
      `UPDATE Translates SET TYPE = ${type}, DateSeen = strftime('%s', 'now'), CntSeen = CntSeen + 1 WHERE ID = ${id}` :
      `UPDATE Translates SET TYPE = ${type}, DateSeen = strftime('%s', 'now') WHERE ID = ${id}`;

    if (Capacitor.isNativePlatform())
    {
      return this._sqlite.excuteObservable(query);
    } else
    {
      return of();
    }

  }

}