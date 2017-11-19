import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Title } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'qs-mmf-intro',
  styleUrls: ['./mmfintro.component.scss'],
  templateUrl: './mmfintro.component.html',
})
export class MMFIntroComponent{

}
