import { Component, OnInit } from '@angular/core';
import * as _svc from 'src/app/services';
import * as _mod from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-quotes',
  templateUrl: 'quotes.page.html'
})
export class QuotesPage implements OnInit
{

  seasonId: number = 0;
  episodeId: number = 0;
  quotes: _mod.Quote[] = [];
  loading: boolean = true;
  skeletonArray = Array(15).fill(null);

  constructor(
    private globalService: _svc.GlobalService,
    private router: Router,
    private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void>
  {
    this.seasonId = +this.route.snapshot.paramMap.get('seasonId')!;
    this.episodeId = +this.route.snapshot.paramMap.get('episodeId')!;

    if (this.seasonId && this.episodeId)
    {
      await Preferences.set({ key: 'lastSeasonId', value: this.seasonId.toString() });
      await Preferences.set({ key: 'lastEpisodeId', value: this.episodeId.toString() });
      this.getData();
    } else
    {
      this.seasonId = await this.getPreference('lastSeasonId', 0);
      this.episodeId = await this.getPreference('lastEpisodeId', 0);
      if (this.seasonId && this.episodeId)
      {
        this.getData();
      } else
      {
        this.loading = false;
      }
    }

  }

  async getPreference(key: string, defaultValue: number): Promise<number>
  {
    const { value } = await Preferences.get({ key });
    return value ? +value : defaultValue;
  }

  getData()
  {
    this.loading = true;
    this.globalService.getAllQuote(this.seasonId, this.episodeId).subscribe(data =>
    {
      this.quotes = data;
      this.loading = false;
    });
  }

  setLeitnerCard(quote: _mod.Quote)
  {
    quote.CntSeen = 1;
    this.globalService.setLeitnerCard(quote.ID).subscribe();
  }

  back()
  {
    this.router.navigate(['/app', this.seasonId]);
  }

}