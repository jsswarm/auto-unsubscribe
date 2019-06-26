import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export function AutoUnsubscribe() {
  return (target, key) => {

    if (!target._isAutoUnsubscribeSetup) {

      Object.defineProperty(target, '_onDestroy$', {
        get: function () {
          return this['__onDestroy$'] = this['__onDestroy$'] || new Subject();
        }
      });

      const onDestroy = target.constructor.ngComponentDef.onDestroy;
      target.constructor.ngComponentDef.onDestroy = function () {
        this._onDestroy$.next();
        this._onDestroy$.complete();
        return onDestroy && onDestroy();
      }

      target._isAutoUnsubscribeSetup = true;

    }

    Object.defineProperty(target, key, {
      get: function () {
        return this[`_${key}`];
      },
      set: function (value) {
        if (value != null) {
          value = value.pipe(takeUntil(this._onDestroy$));
        }
        this[`_${key}`] = value;
      }
    });

  };
}
