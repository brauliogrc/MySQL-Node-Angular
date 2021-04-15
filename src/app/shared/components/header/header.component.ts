import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '@pages/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  /**Contendrá las subscripciones realizadas */
  
  isLogged: boolean  = false;
  isAdmin: boolean   = false;

  @Output() toggleSidenav = new EventEmitter<void>();

  onToggleSidenav(): void{
    this.toggleSidenav.emit();
  }

  onLogout(){
    this.authService.logout();
  }

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.isLogged.subscribe( (res) => (this.isLogged = res))
    );
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }
}
