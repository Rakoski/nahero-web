import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  currentYear = signal<number>(new Date().getFullYear());

  ngOnInit() {}
}
