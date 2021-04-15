import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@pages/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(private authService:AuthService){}

  canActivate(): Observable<boolean>{
    /**canActivate: Interfaz que una clase puede implementar para ser un guardia que decide si se puede activar una ruta. si todos los guardianes
     * regresan 'true' , la navegación es continua. Si algún guardia regresa 'false', se cancela la navegación. */
    return this.authService.isLogged.pipe(
      take(1), //Emite el primer valor del Observable
      map( ( isLogged:boolean ) => !isLogged)
    );
    // return true;
  }
  
}
