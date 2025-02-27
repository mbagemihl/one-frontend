import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from "@angular/router";
import mqtt, {MqttClient} from "mqtt";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private readonly router = inject(Router);
    mqttClient: MqttClient;
    constructor() {
        this.mqttClient = mqtt.connect('ws://test.mosquitto.org:8081');
        this.mqttClient.on('connect', () => {
            console.log('connected');
            this.mqttClient.subscribe('navigation', (err) => {
                if(err) {
                    console.error(err);
                }
            });
        });
        this.mqttClient.on('message', (topic, message) => {
            console.log(topic, message.toString());
            if(topic === 'navigation') {
                if(!message) return;

                    this.router.navigate([message.toString()]);

            }
        });
    }

    navigate(path: string) {
        console.log("WTF");
        this.mqttClient.publish("navigation", path);
    }
}
