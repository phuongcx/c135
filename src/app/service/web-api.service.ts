import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/Http';

@Injectable({
  providedIn: 'root'
})

export class WebAPIService {

  constructor(private _httpClient: HttpClient, @Inject('Url') @Optional() public Url: string) {
    this.Url = Url;
  }

  reqHeader = new HttpHeaders({ 'Content-Type': 'application/JSON', 'No-Auth': 'False' });

  /**
   * Get all data
   * @param Controller The controller string you want to get data
   * @return A list of objects in the webAPI
   */
  FetchAll(Controller) {
    return this._httpClient.get(this.Url + Controller + "/", { headers: this.reqHeader });
  }

  /**
   * Fetch all data but you can skips item and takes how many item you want
   * @param skips How many items you want to skips?
   * @param takes How many items you want to takes?
   */
  GetAllWithSkips(Controller, skips: number, takes: number) {
    return this._httpClient.get(this.Url + Controller + "/" + skips + "/" + takes + "/", { headers: this.reqHeader });
  }

  /**
   * Get an object
   * @param Controller The controller string you want to get data
   * @param id The ID of an objects you want to get details
   * @return The details of object(Id)
   */
  GetDetails(Controller, id) {
    return this._httpClient.get(this.Url + Controller + "/" + id, { headers: this.reqHeader });
  }

  /**
   * Add an object to database
   * @param Controller The controller string you want to get data
   * @param object the object you want to add to database
   */
  Add(Controller, object) {
    return this._httpClient.post(this.Url + Controller + "/", object, { headers: this.reqHeader });
  }

  /**
   * Remove an object out of database
   * @param Controller The controller string you want to get data
   * @param id The ID of an objects you want to delete
   */
  Delete(Controller, id) {
    return this._httpClient.delete(this.Url + Controller + "/" + id, { headers: this.reqHeader });
  }

  /**
   * Update object in database
   * *Warning: The Id of new object must be same with old object
   * @param Controller The controller string you want to get data
   * @param object the object you want to update to database
   */
  Update(Controller, object) {
    return this._httpClient.put(this.Url + Controller + "/", object, { headers: this.reqHeader });
  }

}
