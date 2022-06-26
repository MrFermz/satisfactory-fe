import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  public getBuilding() {
    return this.http.get('assets/building.json').pipe()
  }

  public getItems() {
    return this.http.get('assets/items.json').pipe()
  }
}
