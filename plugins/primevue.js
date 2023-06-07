
// import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import {PrimeIcons} from 'primevue/api';
import Button from "primevue/button";
import Card from "primevue/card";
import Sidebar from 'primevue/sidebar';
import RadioButton from 'primevue/radiobutton';
import InputSwitch from 'primevue/inputswitch';
import Tree from 'primevue/tree';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {ripple: true});

    nuxtApp.vueApp.component('Button', Button);
    nuxtApp.vueApp.component('Card', Card);
    nuxtApp.vueApp.component('Sidebar', Sidebar);
    nuxtApp.vueApp.component('RadioButton', RadioButton);
    nuxtApp.vueApp.component('InputSwitch', InputSwitch);
    nuxtApp.vueApp.component('Tree', Tree);
    nuxtApp.vueApp.component('Tag', Tag);
    nuxtApp.vueApp.component('DataTable', DataTable);
    nuxtApp.vueApp.component('Column', Column);
    nuxtApp.vueApp.component('InputText', InputText);
    nuxtApp.vueApp.component('Dropdown', Dropdown);
    nuxtApp.vueApp.component('TabView', TabView);
    nuxtApp.vueApp.component('TabPanel', TabPanel);

    nuxtApp.vueApp.component('Splitter', Splitter);
    nuxtApp.vueApp.component('SplitterPanel', SplitterPanel);
    nuxtApp.vueApp.component('Menu', Menu);
    nuxtApp.vueApp.component('Menubar', Menubar);
});

