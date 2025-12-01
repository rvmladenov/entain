import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([
          { path: 'game', component: HomeComponent }, // Dummy component for route
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(title.textContent).toContain('Sudoku by rvm');
  });

  it('should have a button that navigates to /game', async () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toBe('Go to game');

    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });
});
