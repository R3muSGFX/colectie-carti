import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Styles
import '@/assets/styles.scss';

// Main logic
const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    ripple: true,
    inputStyle: 'filled',
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    zIndex: {
        modal: 1100,        //dialog, drawer
        overlay: 1000,      //select, popover
        menu: 1000,         //overlay menus
        tooltip: 1100       //tooltip
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');