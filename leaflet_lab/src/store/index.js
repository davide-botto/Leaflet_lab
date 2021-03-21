import Vue from "vue";
import Vuex from "vuex"
import {layers} from "./layers.module"
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        layers        
    }
});