import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from '../src/auto-unsubscribe';

function createTestComponent() {

    const tearDownSpy = jest.fn();

    @Component({
        template: ''
    })
    class TestComponent implements OnInit {

        @AutoUnsubscribe()
        data$ = new Observable(() => {
            return tearDownSpy;
        });

        ngOnInit() {
            this.data$.subscribe();
        }

    }

    return {
        tearDownSpy,
        TestComponent
    };

}

describe('AutoUnsubscribe', () => {

    xit('🚧 should unsubscribe from observable when component is destroyed', () => {

        const {TestComponent, tearDownSpy} = createTestComponent();

        // call TestComponent.ngOnInit()
        // compile component with IVy.
        // check tearDownSpy is not called yet.
        // trigger component onDestroy.
        // check tearDownSpy is now called.

        throw new Error('🚧 work in progress!');

    });

    it.todo('🚧 should unsubscribe from observable when observable is replaced by another');

});
