/* eslint-disable @typescript-eslint/naming-convention */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  name: 'Ionic Chat',
  middleware: 'api/',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MQTT: {
    username: 'spatch',
    password: 'cn0zrT7idUqxSU3',
    server: 'rabbitmq.demo.intellitronika.com',
    port: '443',
    protocoll: 'wss',
    endpoint: '',
    subscriptions: {
      status: 'stagemap/status'
    },
  },
  API: {
      backend: 'http://stagechat.svil.intellitronika.com'
    },
  recaptcha: {
    siteKey: '6LdA7FcjAAAAAMyL0X_erT301CEdYBA3GztQPb4F',
    },
  googleAgm: {
    MapsKey: 'AIzaSyDMgwrW11u3Jyn9A-xWWukvPDMN8c33N_I',
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
