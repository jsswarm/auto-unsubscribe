import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from '../src/auto-unsubscribe';

function createTestComponent() {
  const onDestroySpy = jest.fn();
  const tearDownSpy = jest.fn();

  @Component({
    template: ''
  })
  class TestComponent implements OnDestroy, OnInit {
    @AutoUnsubscribe()
    data$ = new Observable(() => tearDownSpy);

    ngOnInit() {
      this.data$.subscribe();
    }

    ngOnDestroy() {
      onDestroySpy();
    }
  }

  return {
    onDestroySpy,
    tearDownSpy,
    testComponent: new TestComponent()
  };
}

describe('AutoUnsubscribe', () => {
  it('should unsubscribe from observable when component is destroyed', () => {
    const { onDestroySpy, tearDownSpy, testComponent } = createTestComponent();

    testComponent.ngOnInit();

    expect(tearDownSpy).not.toHaveBeenCalled();

    testComponent.ngOnDestroy();

    /* Make sure that `ngOnDestroy` is wrapped and not replaced. */
    expect(onDestroySpy).toHaveBeenCalledTimes(1);

    /* Check that the observable has been unsubscribed from. */
    expect(tearDownSpy).toHaveBeenCalledTimes(1);
  });

  xit('🚧 should unsubscribe from observable even when replaced by another', () => {
    const { tearDownSpy, testComponent } = createTestComponent();

    testComponent.ngOnInit();

    testComponent.data$ = null;

    const newTearDownSpy = jest.fn();

    testComponent.data$ = new Observable(() => newTearDownSpy);

    expect(tearDownSpy).not.toHaveBeenCalled();
    expect(newTearDownSpy).not.toHaveBeenCalled();

    testComponent.ngOnDestroy();

    expect(tearDownSpy).toHaveBeenCalledTimes(1);
    expect(newTearDownSpy).toHaveBeenCalledTimes(1);
  });
});
