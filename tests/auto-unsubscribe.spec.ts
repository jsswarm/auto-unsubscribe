import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from '../src/auto-unsubscribe';

function createTestComponent() {

    const tearDownSpy = jest.fn();

    @Component({
        template: ''
    })
    class TestComponent implements OnDestroy, OnInit {

        @AutoUnsubscribe()
        data$ = new Observable(() => {
            return tearDownSpy;
        });

        ngOnInit() {
            this.data$.subscribe();
        }

        ngOnDestroy = jest.fn();

    }

    return {
        tearDownSpy,
        testComponent: new TestComponent()
    };

}

describe('AutoUnsubscribe', () => {

    xit('🚧 should unsubscribe from observable when component is destroyed', () => {

        const {testComponent, tearDownSpy} = createTestComponent();

        testComponent.ngOnInit();

        expect(tearDownSpy).not.toHaveBeenCalled();

        testComponent.ngOnDestroy();

        expect(tearDownSpy).toHaveBeenCalledTimes(1);

    });

    it.todo('🚧 should unsubscribe from observable when observable is replaced by another');

});
