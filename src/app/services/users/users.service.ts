import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IUserInfo } from 'src/app/interfaces/user-info';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users'; // Base URL for the users API

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

  /**
   * Validates user credentials against the existing users in the API.
   *
   * @param {Object} userCredentials - The credentials to validate.
   * @param {string} userCredentials.usernameOrEmail - The username or email to check.
   * @param {string} userCredentials.password - The password to validate.
   * @returns {Observable<boolean>} An observable that emits true if the user exists and the password matches, false otherwise.
   */
  validateUser(userCredentials: {
    usernameOrEmail: string;
    password: string;
  }): Observable<boolean> {
    return this.getExistingUsers().pipe(
      map((users) => this.isUserValid(users, userCredentials))
    );
  }

  /**
   * Checks if the provided user credentials match any existing user.
   *
   * @param {IUserInfo[]} users - The list of existing users.
   * @param {Object} userCredentials - The credentials to validate.
   * @param {string} userCredentials.usernameOrEmail - The username or email to check.
   * @param {string} userCredentials.password - The password to validate.
   * @returns {boolean} True if the user exists and the password matches, false otherwise.
   */
  private isUserValid(users: IUserInfo[], userCredentials: {
    usernameOrEmail: string;
    password: string;
  }): boolean {
    return users.some(
      (user) =>
        (user.username === userCredentials.usernameOrEmail ||
          user.email === userCredentials.usernameOrEmail) &&
        user.password === userCredentials.password
    );
  }
}
