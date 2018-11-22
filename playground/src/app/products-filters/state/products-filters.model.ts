import { ID } from '../../../../../akita/src';

export type ProductPlant = {
  id: number;
  title: string;
  scientificName: string;
  familly: string;
  description: string;
  origin: string;
  price: number;
  category: string, //"Interior|Garden|Balcony|Flowers|Tree|Roses"
  size: string,
  image: string,
  rapidDelivery: boolean
};
