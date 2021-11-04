import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverlayModule as MatOverlayModule } from '@angular/cdk/overlay';

import { OverlayComponent } from './overlay.component';
import { OverlayTriggerDirective } from './overlay-trigger.directive';

@NgModule({
  declarations: [OverlayComponent, OverlayTriggerDirective],
  imports: [CommonModule, MatOverlayModule],
  exports: [OverlayComponent, OverlayTriggerDirective],
})
export class OverlayModule {}
