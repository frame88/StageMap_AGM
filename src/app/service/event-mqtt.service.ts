/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMqttMessage, IMqttServiceOptions, MqttConnectionState, MqttService } from 'ngx-mqtt';


@Injectable({
  providedIn: 'root'
})
export class EventMqttService {

    // eslint-disable-next-line @typescript-eslint/naming-convention
  MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    connectOnCreate: false,
    hostname: environment.MQTT.server,
    port: Number(environment.MQTT.port),
    path: '/ws',
    // eslint-disable-next-line eqeqeq
    protocol: environment.MQTT.protocoll == 'ws' ? 'ws' : 'wss',
    username: environment.MQTT.username,
    password: environment.MQTT.password,
  };

  constructor(@Inject(MqttService) private mqttService: MqttService) {
    mqttService.connect(this.MQTT_SERVICE_OPTIONS);
  }
  ConnectionState = (): Observable<MqttConnectionState> =>
  this.mqttService.state;

  topic = (topic: string): Observable<IMqttMessage> =>
    this.mqttService.observe(`${topic}`);
}
