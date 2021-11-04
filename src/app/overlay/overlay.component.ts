import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef, OverlaySizeConfig, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { fromEvent } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { OverlayTriggerDirective } from './overlay-trigger.directive';

import { BaseTakeUntil } from '../shared';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['overlay.componenta.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent extends BaseTakeUntil implements OnInit {
  @ViewChild('template') template!: TemplateRef<any>;
  @Input() trigger!: OverlayTriggerDirective;
  @Input() width: number | string | undefined;
  @Input() height: number | string | undefined;
  @Input() minWidth: number | string | undefined;
  @Input() minHeight: number | string | undefined;
  @Input() maxWidth: number | string | undefined;
  @Input() maxHeight: number | string | undefined = '100%';
  @Input() hasBackdrop = true;
  @Input() originX: 'start' | 'center' | 'end' = 'start';
  @Input() originY: 'top' | 'center' | 'bottom' = 'top';
  @Input() overlayX: 'start' | 'center' | 'end' = 'start';
  @Input() overlayY: 'top' | 'center' | 'bottom' = 'top';

  @Output('close') closeEmitter = new EventEmitter();

  overlayRef: OverlayRef | null = null;

  private fullscreen = false;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    console.log(this.trigger);
    fromEvent<MouseEvent>(this.trigger.elementRef.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.open(event));

    this.overlayRef = this.overlay.create({ hasBackdrop: this.hasBackdrop });

    fromEvent(document, 'click')
      .pipe(
        filter((event) => !this.overlayRef?.overlayElement.contains(event.target as HTMLElement)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.close());
  }

  ngOnDestroy() {
    this.overlayRef?.dispose();
    super.ngOnDestroy();
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      this.closeEmitter.emit();
    }
  }

  open(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.close();

    this.updateSize();
    this.updatePosition();
    this.overlayRef?.attach(new TemplatePortal(this.template, this.viewContainerRef));
  }

  setFullscreen(data: boolean) {
    this.fullscreen = data;
    this.updatePosition();
    this.updateSize();
  }

  private updatePosition() {
    const positionStrategy = this.fullscreen ? this.overlay.position().global() : this.getPositionStrategy();
    this.overlayRef?.updatePositionStrategy(positionStrategy);
  }

  private updateSize() {
    const config = this.fullscreen ? { width: '100%', height: '100%' } : this.getOverlaySizeConfig();
    this.overlayRef?.updateSize(config);
  }

  private getPositionStrategy(): PositionStrategy {
    return this.overlay.position().flexibleConnectedTo(this.trigger.elementRef).withPositions([this.position]);
  }

  private get position(): ConnectedPosition {
    return { originX: this.originX, originY: this.originY, overlayX: this.overlayX, overlayY: this.overlayY };
  }

  private getOverlaySizeConfig(): OverlaySizeConfig {
    return {
      width: this.width,
      height: this.height,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
    };
  }
}
