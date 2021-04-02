import { InjectionToken, Type } from '@angular/core';

export const _ROOT_EFFECTS = new InjectionToken<Type<any>[]>('@datorama/akita Internal Root Effects');

export const ROOT_EFFECT_INSTANCES = new InjectionToken<Type<any>[]>('@datorama/akita Root Effects');

export const _FEATURE_EFFECTS = new InjectionToken<Type<any>[]>('@datorama/akita Internal Feature Effects');

export const FEATURE_EFFECT_INSTANCES = new InjectionToken<Type<any>[]>('@datorama/akita Feature Effects');
