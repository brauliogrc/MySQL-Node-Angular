import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@pages/auth.service';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  private subscriptions: Subscription = new Subscription();
  /**Contendrá las subscripciones realizadas */
  
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });

  constructor(
    private authService:AuthService,
    private fb:FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLogin(){
    const formValue = this.loginForm.value;
    console.log(this.loginForm.value);
    
    this.subscriptions.add(
      /**Agregamos la subscription a nuestra variable de tipo 'Susbcriotion' */
      this.authService.login(formValue).subscribe( res => {
        /**El métdo "subscribe" activa el Obserable habilita al bserver a recivr ntovifaciones del stream. El observer por si mismo
         * no devolverá ningún valor hasta que se active la comunicación entre ambas partes. Este mecanismo es la subscripción.
         * Realizamos el "subscibe" al método "login()" del servicio 
         */
        if (res){
          this.router.navigate(['']);
          // Nos redirecciona la pagina Home
        }
      })
    );
  }

}
