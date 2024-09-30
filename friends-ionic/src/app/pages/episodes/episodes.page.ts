import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _svc from 'src/app/services';
import * as _mod from 'src/app/models';
@Component({
  selector: 'app-episodes',
  templateUrl: 'episodes.page.html'
})
export class EpisodesPage implements OnInit
{
  number: number = 0;
  seasons: _mod.Season[] = [];
  episodes: _mod.Episode[] = [];

  constructor(
    private globalService: _svc.GlobalService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void
  {
    const seasonId = this.route.snapshot.paramMap.get('seasonId');
    this.seasons = this.globalService.getAllEpisode(+seasonId!);
    this.number = this.seasons[0].number;
    this.episodes = this.seasons[0].episodes as _mod.Episode[];
  }

  back()
  {
    this.router.navigate(['/app']);
  }

}