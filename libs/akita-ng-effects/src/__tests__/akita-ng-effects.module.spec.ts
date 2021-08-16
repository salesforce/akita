import { TestBed } from '@angular/core/testing';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { Injectable } from '@angular/core';
import { FEATURE_EFFECT_INSTANCES } from '../lib/tokens';

@Injectable()
class FakeEffects {
  constructor() {}
}

@Injectable()
class FakeEffectsTwo {
  constructor() {}
}

@Injectable()
class FakeEffectsThree {
  constructor() {}
}

describe(`forRoot`, () => {
  it(`should provide FakeEffects`, () => {
    TestBed.configureTestingModule({
      imports: [AkitaNgEffectsModule.forRoot([FakeEffects])],
    });
    const fakeEffects = TestBed.inject(FakeEffects);
    expect(fakeEffects).toBeDefined();
  });
});

describe(`forFeature`, () => {
  let featureInstances;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AkitaNgEffectsModule.forRoot([FakeEffects]), AkitaNgEffectsModule.forFeature([FakeEffectsTwo, FakeEffectsThree]), AkitaNgEffectsModule.forFeature([FakeEffectsTwo])],
    });
    featureInstances = TestBed.inject(FEATURE_EFFECT_INSTANCES);
  });

  it(`should provide feature effect instances once`, () => {
    expect(featureInstances.length).toBe(2);
  });
});
