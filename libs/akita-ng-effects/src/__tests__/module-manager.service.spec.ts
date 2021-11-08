import { Actions } from '@datorama/akita-ng-effects';
import { ModuleManager } from '../lib/module-manager.service';
import { setMetadata } from '../lib/effect.utils';
import { Subject } from 'rxjs';

describe('Module Manager Service', () => {
  let moduleManager: ModuleManager;
  let effectInstance;
  let mixedInstance;
  let mockEffectOne;
  let mockEffectTwo;
  let truthyNoEffect;
  let noEffect;
  let actions$;
  let observable$;

  beforeEach(() => {
    actions$ = new Actions();
    mockEffectOne = Object.create(actions$);
    mockEffectTwo = Object.create(actions$);
    truthyNoEffect = { isEffect: { test: 'test' }};
    setMetadata(mockEffectOne, 'mockEffectOne', {});
    setMetadata(mockEffectTwo, 'mockEffectTwo', {});

    observable$ = new Subject();
    noEffect = observable$;

    moduleManager = new ModuleManager(new Actions());
    effectInstance = {
      actions$,
      mockEffectOne,
      mockEffectTwo,
    };
    mixedInstance = {
      mockEffectOne,
      noEffect,
      truthyNoEffect,
    };
  });

  it('should add effects to the instance sources', () => {
    const spy = jest.spyOn(moduleManager.effectInstanceSources, 'add');
    moduleManager.add(effectInstance);
    moduleManager.add(effectInstance);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should subscribe only to effects', () => {
    moduleManager.subscribeToEffects(effectInstance);
    moduleManager.subscribeToEffects(mixedInstance);

    expect(actions$.observers.length).toBe(3);
  });

  it('should unsubscribe all on destroy', () => {
    moduleManager.subscribeToEffects(effectInstance);
    moduleManager.subscribeToEffects(mixedInstance);
    moduleManager.ngOnDestroy();

    expect(actions$.observers.length).toBe(0);
  });
});
