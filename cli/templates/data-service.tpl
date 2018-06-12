import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class {{ pascalCase name}}DataService {

  constructor(private http: HttpClient) {
  }

}
