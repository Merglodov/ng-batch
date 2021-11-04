import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOverlayTrigger]',
  exportAs: 'overlayTrigger',
})
export class OverlayTriggerDirective {
  constructor(public elementRef: ElementRef) {}
}
