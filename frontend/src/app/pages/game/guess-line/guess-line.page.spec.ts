import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessLinePage } from './guess-line.page';

describe('GuessLinePage', () => {
  let component: GuessLinePage;
  let fixture: ComponentFixture<GuessLinePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessLinePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
