import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Dialog} from "@angular/cdk/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import mqtt, {MqttClient} from "mqtt";

@Component({
    selector: 'app-root',
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'one-frontend';
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
