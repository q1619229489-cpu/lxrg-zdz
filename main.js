import App from "./App"

// #ifndef VUE3
import Vue from "vue"
import "./uni.promisify.adaptor"
Vue.config.productionTip = false
App.mpType = "app"
var app = new Vue({ ...App })
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue"
export function createApp() {
  var app = createSSRApp(App)
  return { app: app }
}
// #endif
