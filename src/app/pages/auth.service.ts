import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import { User, UserResponse } from '@shared/components/models/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  /**Recuerda el último valor emitido por el obserbable a todas las nuevas subscripciones, al margen del momento temporal en que estas
   * se establescan, actuando como un mecanismo de sincronización entre todas las subscripciones.
   */

  constructor(private http:HttpClient, private router:Router) { // Inyección del servicio HttpClient como una dependencia de clase de aplicación.
    /**router habilita la navegación inerpretando la URL de un navegador como una instrucción para cambiar la vista */
    this.checkToken(); // Llamada al método "checkToken()"
  }

  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
    /**Crea un objeto Observable con este asunto como fuente */
  }


  login(authData:User):Observable<UserResponse | void>{
    return this.http.post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
    /**Realizamos la peticion POST a la API.
     * En "environment.API_URL" se encuentra la dirección y el puerto del servidor que esta corriendo en nuestra API.
     */
    .pipe(
      /**Toma como arguemento las funciones que desea combinar y devuvlve una nueva función que, cuando se ejecuta, ejecuta
       * las funciones compuestas en frecuencia
       */
      map( (res:UserResponse) => {
        /**Al igual que 'Array.prototype.map()' pasa cada valor de origen a través de una función de transformación para obtener los
         * valores de salida corespondientes.
         */
        // console.log('Res -->', res);
        this.saveToken( res.token ); // Llamada al método de guadar token
        this.loggedIn.next(true); // Cambiamos el estado de esta propiedad, para que sea true en caso de que el usuario se encuentre logeado
        return res;
      }),
      catchError( (err) => this.handlerError(err) )
      /**Enviamos los observables devueltos al controlador de erroress */
    );
    // El tipo de petición

  }

  logout():void{
    localStorage.removeItem('token');
    /**Removemos la Key almacenada en el local storage, solo pasamos como argumento el nombre de la key */
    this.loggedIn.next(false); // Cambiamos el estado de esta propiedad, para que sea false en caso de que el usuario no se encuentre logeado
    // Se emite el valor false en este caso
    this.router.navigate(['/login']);
    // Nos redirecciona la pagina del Login
  }

  private checkToken():void{
    const userToken: any = localStorage.getItem('token'); // Obtenemos el valor la propiedad 'token' almacenada en el local storage
    const isExpired = helper.isTokenExpired( userToken );
    /**Es un boolean que revuvle true en caso de que el token ya haya expirado */
    console.log('isExpired ->', isExpired);

    if (isExpired) {
      this.logout(); // Llamada a la función logout
    } else {
      this.loggedIn.next(true);
      /**Cambio del valor de emisión de la variable "loggedIn"*/
    }
  }

  private saveToken(token:string):void{
    localStorage.setItem('token', token);
    /**Guardamos el token en el local storage, pasamos como arguemtnos el key y el valor */
  }

  private handlerError(err:any):Observable<never>{
    let errorMessage = 'As error ocurred retriving data';
    if(err){
      errorMessage = `Error: code ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
    /**No emite elementos al observador e inmediatamente emite una notificación de error.
     * Devuelve  un error Observble: emite solo la notificación de error utilizando el argumento de error dado.
     */
  }
}
