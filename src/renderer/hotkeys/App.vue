<template>
  <div class="theme-white">
    Hello {{msg}}!2
    <Hotkey />
  </div>
</template>

<script>
import Vue from "vue";
import Hotkey from "./Hotkey.vue";

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    window.close();
  }
});

export default {
  components: { Hotkey },
  data() {
    return {
      msg: "Vue"
    };
  }
};
</script>
