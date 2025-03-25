import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-termeknezet',
  standalone: false,
  
  templateUrl: './termeknezet.component.html',
  styleUrl: './termeknezet.component.css'
})
export class TermeknezetComponent {

  termekId: string | null = null;
  kategoria: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.kategoria = this.route.snapshot.paramMap.get('kategoria');
    this.termekId = this.route.snapshot.paramMap.get('id');

    console.log('Kategória:', this.kategoria);
    console.log('Termék ID:', this.termekId);
  }

}
