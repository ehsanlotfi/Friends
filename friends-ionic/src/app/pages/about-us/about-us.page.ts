import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: 'about-us.page.html'
})
export class AboutUsPage
{

  constructor() { }

  sendEmail()
  {
    window.open('mailto:ehsanarian70@gmail.com');
  }

}
