import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabVisibilityService {

   private visibilityChangeSub!: Subscription;

  // Observable to expose current visibility state
  private _isTabVisible = new BehaviorSubject<boolean>(!document.hidden);
  public isTabVisible$ = this._isTabVisible.asObservable();

  private ignoreFirstEvent = true;

  constructor() {
    // this.visibilityChangeSub = fromEvent(document, 'visibilitychange').subscribe(() => {
    //   if (this.ignoreFirstEvent) {
    //     this.ignoreFirstEvent = false;
    //     return;
    //   }

    //   const visible = !document.hidden;
    //   this._isTabVisible.next(visible);

    //   if (visible) {
    //     console.log('🟢 User returned to the tab');
    //     alert('✅ Welcome back to the tab!');
    //   } else {
    //     console.log('🔴 User left the tab');
    //     alert('⚠️ You left the tab!');
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.visibilityChangeSub.unsubscribe();
  }
}