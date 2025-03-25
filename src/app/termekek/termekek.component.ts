import { Component, EventEmitter, Output } from '@angular/core';
import { BaseService } from '../base.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-termekek',
  standalone: false,
  templateUrl: './termekek.component.html',
  styleUrls: ['./termekek.component.css']
})
export class TermekekComponent {

  cipok: any[] = [];
  mezek: any[] = [];
  labdak: any[] = [];
  palank: any[] = [];
  poszterek: any[] = [];
  keresoSzo:any = "";
  szurtMeret: string = "";
  szurtMarka: string = "";
  szurtSzin: string = "";

  meretek: string[] = [];
  markak: string[] = [];
  szinek: string[] = [];
  rendezesTomb=["Alapértelmezett","Olcsók elől","Drágák elől"];
  rendezesAllapot=1;
  termekek = this.cipok && this.labdak && this.mezek && this.palank && this.poszterek;
  cartService: any;

  buyer = {
    name: '',
    email: '',
    address: '',
    phone: ''
  };

  isPopupVisible = false;
  selectedTermek: any;

  @Output() close = new EventEmitter<void>();

  openPopup(termek: any): void {
    this.selectedTermek = termek
    this.isPopupVisible = true
  }

  closePopup(): void {
    this.isPopupVisible = false
  }

  isModalVisible = false;

  constructor(private base: BaseService, private search: SearchService) { 
    this.search.getSearchWord().subscribe(
      (res) => this.keresoSzo = res
    );
    this.getTermekek();
  }

  getTermekek() {
    this.base.getProducts().subscribe((data: any) => {
      this.termekek = [
        ...data.cipok.map((t: any) => ({ ...t, kategoria: 'cipok' })), 
        ...data.mezek.map((t: any) => ({ ...t, kategoria: 'mezek' })), 
        ...data.labdak.map((t: any) => ({ ...t, kategoria: 'labdak' })), 
        ...data.palank.map((t: any) => ({ ...t, kategoria: 'palank' })), 
        ...data.poszterek.map((t: any) => ({ ...t, kategoria: 'poszterek' }))
      ];
      this.extractFilters();
    });
  }

  extractFilters() {
    this.markak = [...new Set(this.cipok.map(cipo => cipo.marka))];
    this.szinek = [...new Set(this.cipok.map(cipo => cipo.szin))];
    this.meretek = [...new Set(this.cipok.flatMap(cipo => cipo.meret))].sort((a, b) => a - b);
  }

  szurtCipok() {
    return this.cipok.filter(cipo => {
      return (!this.szurtMeret || cipo.meret.includes(Number(this.szurtMeret))) &&
             (!this.szurtMarka || cipo.marka === this.szurtMarka) &&
             (!this.szurtSzin || cipo.szin === this.szurtSzin);
    });
  }

  onKeyUp(event: any) {
    console.log(event.target.value);
    this.search.setSearchWord(event.target.value);
  }

  RendezesIranyValt() {
    this.rendezesAllapot = (this.rendezesAllapot === 2 ? 0 : ++this.rendezesAllapot);
    if (this.rendezesAllapot === 0) this.rendezesAllapot = 1;
  }

  openModal(termek: any) {
    this.selectedTermek = termek;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  submitForm() {
    if (this.buyer.name && this.buyer.email && this.buyer.address && this.buyer.phone) {
      console.log("Vásárló adatai:", this.buyer);
      this.closeModal()
      alert("Köszönjük a megrendelést, e-mailben tájékoztatunk a továbbiakról!");
    } else {
      alert("Kérjük, töltse ki az összes mezőt.");
    }
  }
}
