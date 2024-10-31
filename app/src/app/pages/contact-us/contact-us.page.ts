import { Component } from '@angular/core';

@Component({
  selector: 'contact-us',
  templateUrl: 'contact-us.page.html'
})
export class ContactUsPage
{

  constructor() { }

  sendEmail()
  {
    window.open('mailto:ehsanarian70@gmail.com');
  }

}
