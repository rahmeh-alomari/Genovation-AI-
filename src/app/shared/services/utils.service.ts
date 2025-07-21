import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  groupByCount<T>(items: T[], key: keyof T): Record<string, number> {
    return items.reduce((acc: Record<string, number>, item: T) => {
      const groupKey = String(item[key]);
      acc[groupKey] = (acc[groupKey] || 0) + 1;
      return acc;
    }, {});
  }
  
}
