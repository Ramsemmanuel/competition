import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  constructor() { }

  generateId = () => Math.floor((Math.random() * 1000000000) + 1);
}
