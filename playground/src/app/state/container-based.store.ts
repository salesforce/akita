import { Store, StoreConfig } from '../../../../akita/src';

export type ContainerBasedState = {
}

export function createInitialContainerBasedState() : ContainerBasedState {
  return {};
}

@StoreConfig({ name: 'container-based' })
export class ContainerBasedStore extends Store<ContainerBasedState> {

  constructor() {
    super(createInitialContainerBasedState());
  }

}

