import { Injectable } from '@angular/core';
import { ContainerBasedStore } from './container-based.store';

@Injectable({
  providedIn: 'root'
})
export class ContainerBasedService {

  constructor(private containerBasedStore: ContainerBasedStore) {
  }

}
