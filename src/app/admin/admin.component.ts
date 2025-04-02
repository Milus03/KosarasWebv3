import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CrudService } from '../crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  loggedUser: any;
  users: any;
  termekek: any[] = [];
  kategoria: string = 'mezek';
  editedTermek = {
    nev: '',
    ar: 0,
    marka: '',
    leiras: '',
    path: ''
  };
  selectedTermek: any;
  isPopupVisible = false;

  constructor(private auth: AuthService, private crud: CrudService, private router:Router) {
    this.auth.getLoggedUser().subscribe(
      (loggedUser) => {
        this.loggedUser = loggedUser;
        console.log('Users logged', this.loggedUser);
        if (this.loggedUser) this.auth.getUsers()?.subscribe(
          (users) => this.users = users
        );
      }
    );
  }

  ngOnInit(): void {
    this.loadTermekek();
  }

  setCustomClaims(uid: any, claims: any) {
    this.auth.setUserClaims(uid, claims)?.subscribe(
      () => console.log('Claims beállítás!')
    );
  }

  change(uid: any) {
    let tomb = this.users.filter(
      (elem: any) => elem.uid == uid
    );
    console.log(tomb);
    this.auth.setUserClaims(uid, tomb[0].claims)?.subscribe();
  }

  loadTermekek(): void {
    this.crud.getTermekek(this.kategoria).subscribe(data => {
      this.termekek = data ? Object.entries(data)
        .map(([key, value]: any) => ({ id: key, ...value }))
        .filter(termek => termek.nev && termek.ar) : []; // Csak érvényes termékek maradjanak
    });
  }
  


  // Termék szerkesztése
  openEditPopup(termek: any): void {
    this.selectedTermek = termek;
    this.editedTermek = { ...termek };
    this.isPopupVisible = true;
  }

  openDeletePopup(termek: any): void {
    this.selectedTermek = termek;
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  saveEditedTermek(): void {
      this.crud.updateTermek(this.kategoria, this.selectedTermek.id-1, this.editedTermek).subscribe(() => {
        alert('Termék sikeresen frissítve!');
        this.closePopup();
        this.loadTermekek();
      });
  }

  deleteTermek(id: number): void {
      this.crud.deleteTermek(this.kategoria, id-1).subscribe(() => {
        this.termekek = this.termekek.filter(termek => termek.id-1 !== id-1);
      })
      this.loadTermekek()
      this.closePopup()
  }

  editTermek(kategoria: string, id: number): void {
    if (kategoria && id-1) {
    if (kategoria && id-1) {
      this.router.navigate([`editor/${kategoria}/${id}`]);
    } else {
      console.error('Hibás paraméterek:', kategoria, id);
    }
  }
}}