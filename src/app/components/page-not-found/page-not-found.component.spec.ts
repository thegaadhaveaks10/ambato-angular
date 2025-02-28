import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PageNotFoundComponent } from "./page-not-found.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageNotFoundComponent
      ]
    });
  
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  })

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should show proper 404 error text', () => {
    component.errorMessageHeader = '404 Page Not Found !';
    component.errorMessageBody = 'Go to home page';

    console.log(el.nativeElement.innerHTML);
    const errorHeader = el.query(By.css('.error-message-header')),
    errorBody = el.query(By.css('.error-message-body'));

    expect(errorHeader.nativeElement.textContent).toBe(component.errorMessageHeader);
    expect(errorBody.nativeElement.textContent).toBe(component.errorMessageBody);
  });
});