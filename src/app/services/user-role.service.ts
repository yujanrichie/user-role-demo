import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfo, RoleInfo } from '../models/user-role-info';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) { }

  /**
   * Makes a _GET HTTP request to the json server
   * 
   * @param {string} route - The path of the endpoint to be requested
   */
   private get(route: string): Observable<any> {
    const url = 'https://custom.rotacloud.com/angular-challenge/' + route;
    const headers = new HttpHeaders({
        'Accept': 'application/json'
    });

    return this.http.get(url, {headers: headers});
  }

  private getAllRoles(): Observable<RoleInfo[]> {
    return this.get('roles.json');
  }

  private getAllUsers(): Observable<UserInfo[]> {
    return this.get('users.json');
  }
  
}
