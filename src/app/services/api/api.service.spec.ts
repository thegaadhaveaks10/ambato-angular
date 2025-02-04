import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { foodItems } from './../../../assets/food-items.mock';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe('ApiService', () => {
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'assets/json-data/food-items.json';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no unexpected API calls
    httpTestingController.verify();
  });

  /**
   * Test: Service should be created successfully
   */
  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  /**
   * Test: Should return all food items from API
   */
  it('should return all food items', (done) => {
    apiService.getFoodItems().subscribe((items) => {
      expect(items.length).toBe(8);
      done();
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(foodItems);
  });

  /**
   * Test: Should return an empty array when no food items exist
   */
  it('should return an empty food items array if no food items exist', (done) => {
    apiService.getFoodItems().subscribe((items) => {
      expect(items.length).toBe(0);
      done();
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]); // Simulating empty data
  });

  /**
   * Test: Should handle an HTTP error when fetching food items
   */
  it('should handle HTTP error for getFoodItems', (done) => {
    apiService.getFoodItems().subscribe({
      next: () => fail('Expected an error, but got data'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        done();
      }
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  /**
   * Test: Should return food item by given ID
   */
  it('should return food item by given ID', (done) => {
    apiService.getFoodItemByID(3).subscribe((foodItem) => {
      expect(foodItem).toBeTruthy();
      expect(foodItem?.id).toBe(3);
      done();
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(foodItems);
  });

  /**
   * Test: Should return undefined if food item with given ID is not found
   */
  it('should return undefined if no food item found for given ID', (done) => {
    apiService.getFoodItemByID(99).subscribe((foodItem) => {
      expect(foodItem).toBeUndefined();
      done();
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(foodItems);
  });

  /**
   * Test: Should handle an HTTP error when fetching a food item by ID
   */
  it('should handle HTTP error for getFoodItemByID', (done) => {
    apiService.getFoodItemByID(3).subscribe({
      next: () => fail('Expected an error, but got data'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        done();
      }
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
