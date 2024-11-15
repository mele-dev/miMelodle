import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasePage } from './clase.page';

describe('ClasePage', () => {
  let component: ClasePage;
  let fixture: ComponentFixture<ClasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
