/* eslint-disable no-underscore-dangle */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/*
import { IUserResponse } from 'src/app/models/IUserResponse';
import { ToastController } from '@ionic/angular';
import { IUser } from 'src/app/models/IUser';
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
import { NavController } from '@ionic/angular';

import { IAuth } from 'src/app/models/IAuth';
import { IToken } from 'src/app/models/IToken';
import { IUserInfo } from 'src/app/models/IUserInfo';

//importazioni per mqtt
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { IUser } from 'src/app/models/IUser';
import { IStatus } from 'src/app/models/IStatus';
import { EventMqttService } from 'src/app/service/event-mqtt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //variabili per sottoscrizione al mqtt
  onlineUser: IUser;
  users: string[]= [];
  sideMenuUsers: IUser[] = [];


  // Variabili User
  data: IAuth | undefined;
  token: string;
  userData: IUserInfo = {
    token: '',
    expDate: null,
    username: '',
    nome: '',
    cognome: '',
    email:''
  };
  expirationDate: Date;
  user = '';

// Variabili Errore
  error = false;
  errorMessage = '';

  subscriptions: Subscription[] = [];

  now: number;
  date$ = interval(1000).pipe(
    map(() => new Date())).subscribe(
      (r) => {
        this.now = r.getTime() - 7500;  // get Date - 7500 = orario attuale
      }
      );

  tok;
  statusInterval;

  constructor(
    private http: HttpClient, //servizio per comunicare backend con frontend
    private router: Router, //servizio per navigare tra le diverse view di angular
    private navCtrl: NavController, //servizio analogo a quello sopra ma di ionic
    private mqttService: EventMqttService
    ){}

  login({user, pass }: {user: string; pass: string}) {

    const user64 = btoa(user);
    const pass64 = btoa(pass);

    this.data = {
      username: user64,
      password: pass64,
    };

    // Autenticazione e creazione del token
    this.http.post<IToken>(`${environment.API.backend}/api/Auth/Login`, this.data)
    .subscribe((res: IToken ) => {

      if(res.success){

        this.error = false;

        this.token = res.data.token;

        this.expirationDate = res.data.expirationDate;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data.token}`
        });

        this.tok = res.data.token;

        localStorage.setItem('token', JSON.stringify(res.data));

        this.router.navigateByUrl('/nuovapagina', {replaceUrl: true});

      }
      else if(res.errorMessage){
        this.error = true;
        this.errorMessage = res.errorMessage;
      }
    });
  }

    //creazione della funzione refresh token
  refreshToken() {
    const token = JSON.parse(localStorage.getItem('token')).token;

    const _tokenSession = JSON.parse(
      localStorage.getItem('token') ?? ''
    );
    {
    const body = {
      token: _tokenSession.token,
      refreshToken:  _tokenSession.refreshToken
    };

    return this.http
    .post<IToken>(`${environment.API.backend}/api/Auth/RefreshToken`, body)
    .pipe(tap((res) => {
        localStorage.setItem('token', JSON.stringify(res.data));
      }
    ));
  }}
  //termine della funzione

  isLogged(){
    if(localStorage.getItem('token')){

    const boh = JSON.parse(localStorage.getItem('token')).expirationDate; //orario in cui verrò buttato fuori
    //boh è la data di scadenza e new Date la data attuale
    return !!(new Date(boh) < new Date() === false);
    }
  }

  //esci
  logout() {

    this.subscriptions.forEach((sub) =>sub.unsubscribe());
    this.subscriptions = [];
    clearInterval(this.statusInterval);

    this.data = null;
    this.user = '';
    localStorage.clear();

    this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'forward' });
  }

  //inizializzazione del servizio mqtt
  mqttSub(){

    this.userData = JSON.parse(localStorage.getItem('user'));

    // Sottoscrizione STATUS
    this.subscriptions.push(
      this.mqttService.topic('stagemap/status').subscribe((resp: IMqttMessage) => {

        const rtn = resp.payload.toString();
        if(rtn !== ''){

          const dataStatus: IStatus = JSON.parse(rtn);

          if (!this.users.includes(dataStatus.user) && dataStatus.user !== this.user){

            const onlineAt= new Date(dataStatus.timestamp).getTime();

            this.users.push(dataStatus.user);

            this.sideMenuUsers.push({
              user: dataStatus.user,
              url:`/chat/${dataStatus.user}`,
              icon: 'mail',
              timestamp: onlineAt,
              notifications: null
            });

            localStorage.setItem('usersOnline', JSON.stringify(this.users));

            localStorage.setItem('menuUsers', JSON.stringify(this.sideMenuUsers));

          }
          else if (this.users.includes(dataStatus.user) ){

            const time = new Date(dataStatus.timestamp);

            for(const element of this.sideMenuUsers){

              if(element.user === dataStatus.user){
                element.timestamp = time.getTime();
              }
            }
          }
        }
      })
    );
  }
}
