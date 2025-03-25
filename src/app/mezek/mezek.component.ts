import { Component, EventEmitter, Output } from '@angular/core';
import { BaseService } from '../base.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-mezek',
  standalone: false,
  templateUrl: './mezek.component.html',
  styleUrl: './mezek.component.css'
})
export class MezekComponent {

  mezek: any[] = []
  keresoSzo:any = "";
  szurtMeret: string = "";
  szurtMarka: string = "";
  szurtSzin: string = "";

  meretek: string[] = [];
  markak: string[] = [];
  szin: string[] = [];
  rendezesTomb=["Alapértelmezett","Olcsók elől","Drágák elől"];
  rendezesAllapot=1;
  cartService: any;
  constructor(private base:BaseService, private search:SearchService) {
    this.search.getSearchWord().subscribe(
      (res)=>this.keresoSzo=res
    )
    this.getMezek()
  }

  getMezek() {
    this.base.getProducts().subscribe((data:any) => {
      this.mezek = data.mezek
      this.extractFilters()
    })
  }

  extractFilters() {
    this.markak = [...new Set(this.mezek.map(mezek => mezek.marka))]
    this.szin = [...new Set(this.mezek.map(mezek => mezek.szin))]
    this.meretek = [...new Set(this.mezek.flatMap(mezek => mezek.meret))].sort((a, b) => a - b)
  }

  szurtMezek() {
    return this.mezek.filter(mezek => {
      return (!this.szurtMeret || mezek.meret === this.szurtMeret) &&
              (!this.szurtMarka || mezek.marka === this.szurtMarka) &&
              (!this.szurtSzin || mezek.szin === this.szurtSzin)
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

  addToCart(product: any) {
    this.cartService.addToCart(product).subscribe(() => {
      alert('Termék hozzáadva a kosárhoz!');
    });
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
