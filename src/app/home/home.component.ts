import {Component, inject, signal} from '@angular/core';
import {Dialog} from "@angular/cdk/dialog";
import mqtt, {MqttClient} from "mqtt";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dialog = inject(Dialog);
  dialogCount = signal(0)
  mqttClient: MqttClient;
  constructor() {
    this.mqttClient = mqtt.connect('ws://test.mosquitto.org:8081');
    this.mqttClient.on('connect', () => {
      console.log('connected');
      this.mqttClient.subscribe('popups', (err) => {
        if(err) {
          console.error(err);
        }
      });
    });
    this.mqttClient.on('message', (topic, message) => {
      console.log(topic, message.toString());
      if(topic === 'popups') {
        if(!message) return;
        if(message.toString() === 'open') {
          const dialogRef = this.openDialog();
          dialogRef.closed.subscribe(() => {
            this.publishClose();
          });
        } else if (message.toString() === 'close') {
          if(this.dialog.openDialogs.length > 0) {
            this.dialog.openDialogs[0].close();
          }
        }
      }
    });
  }
  openDialog = () => {
    this.dialogCount.set(this.dialogCount() + 1);
    return this.dialog.open(DialogComponent, {data: this.dialogCount()});
  }

  publishOpen = () => {
    this.mqttClient.publish('popups', 'open');
  }

  publishClose() {
    this.dialogCount.set(this.dialogCount() - 1);
    this.mqttClient.publish('popups', 'close');
  }
}
