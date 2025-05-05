import { EntityStore } from '../lib/entityStore';
import { persistState } from '../lib/persistState';
import { StoreConfig } from '../lib/storeConfig';
import { tick } from './setup';

@StoreConfig({
  name: 'products'
})
class ProductsStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

describe('persistState - Encrypted', () => {
  localStorage.setItem('AkitaStores', '');
  const storage = persistState({ encryptData: true });

  afterAll(() => storage.destroy());

  const products = new ProductsStore();

  it('should encrypt data when stored in session storage', async () => {
    products.add([{ id: 1 }]);
    await tick();
    // This is a very basic check and might not work for all encryption algorithms
    const encryptedPattern = /^[A-Za-z0-9+/=]+$/;
    const storedData = localStorage.getItem('AkitaStores');

    expect(products._value()).toMatchObject({ entities: {1: {id: 1}}, error: null, ids: [1], loading: false });
    expect(storedData).toMatch(encryptedPattern);
  });
})
