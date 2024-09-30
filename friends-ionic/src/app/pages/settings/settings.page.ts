import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { SettingsService } from 'src/app/services';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html'
})
export class SettingsPage implements OnInit
{

  settingsForm: FormGroup;

  constructor(private fb: FormBuilder, private settingSvc: SettingsService)
  {
    this.settingsForm = this.fb.group({
      fontSize: '16px',
      theme: 'auto',
      cefr: '1',
    });
  }

  async ngOnInit(): Promise<void>
  {
    const { value } = await Preferences.get({ key: 'settings' });
    this.settingsForm = this.fb.group(JSON.parse(value as any));
  }

  async onSubmit()
  {
    this.settingSvc.setSettings(this.settingsForm.value);
  }

}
