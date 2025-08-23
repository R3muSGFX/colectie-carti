import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from './App.vue'

const app = createApp(App);
app.use(PrimeVue, {
    ripple: true,
    inputStyle: 'filled',
    theme: Aura,
    zIndex: {
        modal: 1100,        //dialog, drawer
        overlay: 1000,      //select, popover
        menu: 1000,         //overlay menus
        tooltip: 1100       //tooltip
    }
});
app.mount('#app');