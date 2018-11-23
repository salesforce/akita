import { AkitaPlugin, Queries } from '../plugin';


export class FilterPlugin<E = any, S = any> extends AkitaPlugin<E, S> {

  constructor(protected query: Queries<E, S>) {
    super(query);
  }

  destroy() {

  }

}
