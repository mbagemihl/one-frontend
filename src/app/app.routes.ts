import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {HelloComponent} from "./hello/hello.component";

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'hello', component: HelloComponent
    }
];
