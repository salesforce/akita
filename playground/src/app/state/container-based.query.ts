import { ContainerBasedStore, ContainerBasedState } from './container-based.store';
import { Query } from '../../../../akita/src';
import { Injectable } from '@angular/core';


@Injectable()
export class ContainerBasedQuery extends Query<ContainerBasedState> {

  constructor(protected store: ContainerBasedStore) {
    super(store);
  }

}
