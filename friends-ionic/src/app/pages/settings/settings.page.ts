import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { ColorModeService } from 'src/app/services';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html'
})
export class SettingsPage implements OnInit
{

  settingsForm: FormGroup;

  constructor(private fb: FormBuilder, private colorMode: ColorModeService)
  {
    this.settingsForm = this.fb.group({
      fontSize: '16',
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
    await Preferences.set({
      key: 'settings', value: JSON.stringify(this.settingsForm.value)
    });
  }

  async changeColorScheme(event: any)
  {
    const colorMode = event.detail.value;
    this.colorMode.setMode(colorMode);
  }

}
