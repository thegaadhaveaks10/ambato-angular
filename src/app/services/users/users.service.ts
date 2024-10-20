import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserInfo } from 'src/app/interfaces/user-info';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the existing users from the API.
   *
   * @returns {Observable<IUserInfo[]>} An observable that emits an array of IUserInfo objects.
   */
  getExistingUsers(): Observable<IUserInfo[]> {
    return this.http.get<IUserInfo[]>(this.apiUrl);
  }

  /**
   * Adds a new user to the API.
   *
   * @param {IUserInfo} userData - The user data to be added.
   * @returns {Observable<IUserInfo>} An observable that emits the newly created IUserInfo object.
   */
  addNewUser(userData: IUserInfo): Observable<IUserInfo> {
    return this.http.post<IUserInfo>(this.apiUrl, userData);
  }
}
