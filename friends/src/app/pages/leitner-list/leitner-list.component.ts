import { Component, OnInit } from '@angular/core';
import * as _svc from 'src/app/services';
import * as _mod from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leitner-list.components',
  templateUrl: './leitner-list.component.html',
  styleUrls: ['./leitner-list.component.scss']
})
export class LeitnerListComponent implements OnInit
{

  quotes: _mod.Quote[] = [];
  type = _mod.QuoteType;

  constructor(
    private globalService: _svc.GlobalService) { }

  ngOnInit(): void
  {
    this.getData();
  }

  getData()
  {
    this.globalService.getCards().subscribe(data =>
    {
      this.quotes = data;
    });
  }

  setLeitnerType(id: number, type: _mod.QuoteType)
  {
    this.globalService.setLeitnerType(id, type).subscribe(res =>
    {
      this.quotes = this.quotes.filter(item => item.ID != id);
    });
  }




}