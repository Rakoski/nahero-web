import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from '../../../../components/button/button.module';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
  selector: 'app-results',
  imports: [CommonModule, ButtonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  approved: string | null = null;

  constructor(private route: ActivatedRoute, public router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.approved = this.route.snapshot.paramMap.get('result');
    if (this.approved === 'false') this.approved = 'failed';
    else this.approved = 'approved';
    if (!this.approved) {
      return;
    }
  }
}
