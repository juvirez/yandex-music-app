import Vue from "vue";
import App from "./App.vue";

new Vue(App).$mount("#app");

const darkModeWatchMedia = window.matchMedia("(prefers-color-scheme: dark)");
darkModeWatchMedia.addEventListener("change", (e) => {
  switchViewMode(e.matches);
});
switchViewMode(darkModeWatchMedia.matches);

function switchViewMode(isDarkMode) {
  if (isDarkMode) {
    document.body.className = "deco-pane-body theme black theme-black icon-theme-black action-icon-theme-white";
  } else {
    document.body.className = "theme-white icon-theme-white";
  }
}
