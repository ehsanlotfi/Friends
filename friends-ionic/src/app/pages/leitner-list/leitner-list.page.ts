import { Component, OnInit } from '@angular/core';
import * as _svc from 'src/app/services';
import * as _mod from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-leitner-list',
  templateUrl: 'leitner-list.page.html'
})
export class LeitnerListPage implements OnInit
{

  quotes: _mod.Quote[] = [];
  quote?: _mod.Quote;

  type = _mod.QuoteType;
  loading: boolean = true;

  statistics = [
    { title: "آموخته", value: 0, key: "Learned", classes: "bg-success" },
    { title: "بلندمدت", value: 0, key: "LongTermMemory", classes: "bg-warning" },
    { title: "کوتاه‌مدت", value: 0, key: "ShortTermMemory", classes: "bg-tertiary" },
    { title: "یادآوری", value: 0, key: "NeedReview", classes: "bg-danger" }
  ]

  constructor(
    private globalService: _svc.GlobalService) { }

  ngOnInit(): void
  {
    this.getData();
    this.getStatistics();
  }

  getStatistics()
  {
    this.globalService.getStatistics().subscribe((statistics: _mod.Statistics[]) =>
    {
      if (statistics && statistics.length)
      {
        this.statistics.forEach(item =>
        {
          item.value = (statistics[0] as any)[item.key];
        })
      }
    })
  }

  getData()
  {
    this.loading = true;
    this.globalService.getCards().subscribe(data =>
    {
      this.quotes = data;
      if (this.quotes && this.quotes.length)
      {
        this.quote = this.quotes[0];
      }
      this.loading = false;
    }, err =>
    {
      this.loading = false;
    });
  }

  setLeitnerType(id: number, type: _mod.QuoteType)
  {
    this.loading = true;
    const index = this.quotes.findIndex(f => f.ID === id);
    this.globalService.setLeitnerType(id, type).subscribe(res =>
    {
      this.quote = this.quotes[index + 1];
      this.loading = false;
    }, err =>
    {
      this.loading = false;
    });
  }

}