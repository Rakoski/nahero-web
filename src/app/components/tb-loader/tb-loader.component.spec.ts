import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbLoaderComponent } from './tb-loader.component';

describe('TbLoaderComponent', () => {
  let component: TbLoaderComponent;
  let fixture: ComponentFixture<TbLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TbLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TbLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
