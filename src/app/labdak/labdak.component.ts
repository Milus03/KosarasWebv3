import { Component, EventEmitter, Output } from '@angular/core';
import { BaseService } from '../base.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-labdak',
  standalone: false,
  templateUrl: './labdak.component.html',
  styleUrl: './labdak.component.css'
})
export class LabdakComponent {

  labdak: any[] = []
  keresoSzo:any = "";
  szurtMeret: string = "";
  szurtMarka: string = "";
  szurtAnyag: string = "";

  meretek: string[] = [];
  markak: string[] = [];
  anyag: string[] = [];
  rendezesTomb=["Alapértelmezett","Olcsók elől","Drágák elől"];
  rendezesAllapot=1;
  constructor(private base:BaseService, private search:SearchService) {
    this.search.getSearchWord().subscribe(
      (res)=>this.keresoSzo=res
    )
    this.getLabdak()
  }

  getLabdak() {
    return this.base.getProducts().subscribe((data:any) => {
      this.labdak = (data.labdak || []).filter((labdak:any) => labdak != null)
      this.extractFilters()
    })
  }

  extractFilters() {
    this.markak = [...new Set(this.labdak.map(labdak => labdak.marka))];
    this.anyag = [...new Set(this.labdak.map(labdak => labdak.anyag))];
    this.meretek = [...new Set(this.labdak.flatMap(labdak => labdak.meret))].sort((a, b) => a - b)
  }

  szurtLabdak() {
    return this.labdak.filter(labdak => {
      return (!this.szurtMeret || labdak.meret.includes(Number(this.szurtMeret))) &&
              (!this.szurtMarka || labdak.marka === this.szurtMarka) &&
              (!this.szurtAnyag || labdak.anyag === this.szurtAnyag)
    })
  }

  onKeyUp(event:any){
    console.log(event.target.value)
    this.search.setSearchWord(event.target.value)
  }

  RendezesIranyValt(){
    this.rendezesAllapot=(this.rendezesAllapot==2?0:++this.rendezesAllapot)
    if (this.rendezesAllapot==0) this.rendezesAllapot=1
  }

  isPopupVisible = false;
  selectedTermek: any;

  buyer = {
    name: '',
    email: '',
    address: '',
    phone: ''
  };
  isModalVisible = false;

  @Output() close = new EventEmitter<void>();

  openPopup(termek: any): void {
    this.selectedTermek = termek
    this.isPopupVisible = true
  }

  closePopup(): void {
    this.isPopupVisible = false
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
