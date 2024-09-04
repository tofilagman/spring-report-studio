import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppEventService {

  private handlers: Array<any> = []

  /***
   * Adds an event handler to be called when the event is fired.
   * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
   * object the event was fired with.<p>
   * @method subscribe
   * @param fn {Function} Event handler.
   */
  public subscribe(fn: Function) {
    this.handlers.push(fn);
  }

  /***
   * Removes an event handler added with <code>subscribe(fn)</code>.
   * @method unsubscribe
   * @param fn {Function} Event handler to be removed.
   */
  public unsubscribe(fn: Function) {
    for (var i = this.handlers.length - 1; i >= 0; i--) {
      if (this.handlers[i] === fn) {
        this.handlers.splice(i, 1);
      }
    }
  }

  /***
   * Fires an event notifying all subscribers.
   * @method notify
   * @param args {Object} Additional data object to be passed to all handlers.
   * @param e {EventData}
   *      Optional.
   *      An <code>EventData</code> object to be passed to all handlers.
   *      For DOM events, an existing W3C/jQuery event object can be passed in.
   * @param scope {Object}
   *      Optional.
   *      The scope ("this") within which the handler will be executed.
   *      If not specified, the scope will be set to the <code>Event</code> instance.
   */
  public notify(args: any, e: EventData, scope: any) {
    e = e || new EventData();
    scope = scope || this;

    var returnValue;
    for (var i = 0; i < this.handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
      returnValue = this.handlers[i].call(scope, e, args);
    }

    return returnValue;
  }
}

class EventData {
  private _isPropagationStopped = false;
  private _isImmediatePropagationStopped = false;

  /***
   * Stops event from propagating up the DOM tree.
   * @method stopPropagation
   */
  public stopPropagation() {
    this._isPropagationStopped = true;
  }

  /***
   * Returns whether stopPropagation was called on this event object.
   * @method isPropagationStopped
   * @return {Boolean}
   */
  public isPropagationStopped() {
    return this._isPropagationStopped;
  }

  /***
   * Prevents the rest of the handlers from being executed.
   * @method stopImmediatePropagation
   */
  public stopImmediatePropagation() {
    this._isImmediatePropagationStopped = true;
  }

  /***
   * Returns whether stopImmediatePropagation was called on this event object.\
   * @method isImmediatePropagationStopped
   * @return {Boolean}
   */
  public isImmediatePropagationStopped() {
    return this._isImmediatePropagationStopped;
  }
}