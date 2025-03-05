import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { users } from 'src/assets/dummy-users';
import { IUserInfo } from 'src/app/interfaces/user-info';
import { catchError, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('UsersService', () => {
  let usersService: UsersService;
  let httpTestingController: HttpTestingController;
  const apiUrl: string = 'http://localhost:3000/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService],
      imports: [HttpClientTestingModule],
    });

    usersService = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(usersService).toBeTruthy();
  });

  it('should return existing users on success', () => {
    usersService.getExistingUsers().subscribe((usersData: IUserInfo[]) => {
      expect(usersData).toEqual(users);
    });

    const req = httpTestingController.expectOne(apiUrl);
    req.flush(users); // Simulate success response with users data
  });

  it('should handle 404 error when fetching users', () => {
    usersService
      .getExistingUsers()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          return of(null); // Return null on error
        })
      )
      .subscribe();

    const req = httpTestingController.expectOne(apiUrl);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' }); // Simulate 404 error
  });

  it('should handle 500 error when fetching users', () => {
    usersService
      .getExistingUsers()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(error.status).toEqual(500);
          return of(null); // Return null on error
        })
      )
      .subscribe();

    const req = httpTestingController.expectOne(apiUrl);
    req.flush('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error',
    }); // Simulate 500 error
  });

  it('should add a new user successfully', () => {
    usersService.addNewUser(users[1]).subscribe((userData: IUserInfo) => {
      expect(userData).toEqual(users[1]);
    });

    const req = httpTestingController.expectOne(apiUrl);
    req.flush(users[1]); // Simulate successful addition of new user
  });

  it('should handle error when adding new user', () => {
    usersService
      .addNewUser(users[1])
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(error.status).toEqual(400); // Simulate bad request
          return of(null);
        })
      )
      .subscribe();

    const req = httpTestingController.expectOne(apiUrl);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' }); // Simulate 400 error
  });

  it('should validate user credentials correctly', () => {
    spyOn(usersService, 'getExistingUsers').and.returnValue(of(users));

    usersService
      .validateUser({ usernameOrEmail: 'ssa', password: 'Akki@1234' })
      .subscribe((isUserExists: boolean) => {
        expect(isUserExists).toBeTrue();
      });
  });

  it('should return false if the user credentials are invalid', () => {
    spyOn(usersService, 'getExistingUsers').and.returnValue(of(users));

    usersService
      .validateUser({ usernameOrEmail: 'ssa', password: '123' })
      .subscribe((isUserExists: boolean) => {
        expect(isUserExists).toBeFalse();
      });
  });

  it('should handle 404 error during user validation', () => {
    spyOn(usersService, 'getExistingUsers').and.returnValue(
      throwError(
        () => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })
      )
    );

    usersService
      .validateUser({ usernameOrEmail: 'ssa', password: 'Akki@1234' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(error.status).toEqual(404); // Simulate bad request
          expect(error.statusText).toBe('Not Found');
          return of(null);
        })
      )
      .subscribe();
  });

  it('should handle network error during user validation', () => {
    // Spy on getExistingUsers method and return a simulated network error
    spyOn(usersService, 'getExistingUsers').and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Unknown Error',
            status: 0,
            statusText: 'Unknown Error',
            url: apiUrl,
          })
      )
    );

    usersService
      .validateUser({ usernameOrEmail: 'ssa', password: 'Akki@1234' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          expect(error.status).toBe(0); // For network errors, status is usually 0
          expect(error.statusText).toBe('Unknown Error');
          expect(error.error).toBe('Unknown Error');
          return of(null);
        })
      )
      .subscribe();
  });

  // Note: We haven't added the unit testing for the isUserValid() because it is private method and
  // it is indirectly getting tested through the validateuser()

  /*
  return of(null):- By default, when an error is thrown inside an observable, the stream will terminate, 
  and no further values are emitted.
  It provides a fallback in case of an error, ensuring the observable chain continues. 
  This allows us to handle errors gracefully
  */

  afterEach(() => {
    httpTestingController.verify(); // Ensure there are no outstanding HTTP requests
  });
});
