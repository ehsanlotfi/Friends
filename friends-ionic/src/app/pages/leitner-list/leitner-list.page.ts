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

  constructor(
    private globalService: _svc.GlobalService) { }

  ngOnInit(): void
  {
    this.getData();
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
        this.loading = false;
      }
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
    });
  }

}