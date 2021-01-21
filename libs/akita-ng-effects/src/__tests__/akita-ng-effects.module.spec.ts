import { TestBed } from '@angular/core/testing';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { Injectable } from '@angular/core';

@Injectable()
class FakeEffects {
  constructor() {
  }
}

@Injectable()
class FakeEffectsTwo {
  constructor() {
  }
}

describe(`forRoot`, () => {
  it(`should provide FakeEffects`, () => {
    TestBed.configureTestingModule({
      imports: [AkitaNgEffectsModule.forRoot([FakeEffects])]
    });
    const fakeEffects = TestBed.get(FakeEffects);
    expect(fakeEffects).toBeDefined();
  });
});
