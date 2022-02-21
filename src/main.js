import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueHtmlToPaper from 'vue-html-to-paper';
//import Menubar from 'primevue/menubar';
//import FullCalendar from 'primevue/fullcalendar';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
//createApp.use(VueHtmlToPaper)
const app = createApp(App)
app.use(router)

const options = {
    name: '_blank',
    specs: [
      'fullscreen=yes',
      'titlebar=yes',
      'scrollbars=yes'
    ],
    styles: [
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
      'https://unpkg.com/kidlat-css/css/kidlat.css'
    ]
  }
//app.use(VueHtmlToPaper)

app.use(VueSweetalert2)

app.component('Dialog', Dialog); // habilitando componente  de primevue
app.component('Button', Button); // habilitando componente  de primevue 'sePuedeCambiar'
//  app.component('FullCalendar', FullCalendar)
app.mount('#app')
