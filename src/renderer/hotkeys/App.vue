<template>
  <div class="theme-white icon-theme-white page-settings">
    <div class="page-settings__block">
      <h2 class="page-settings__subtitle typo-h2_bold">Global Hotkeys</h2>
      <div class="hotkeys">
        <Hotkey title="Love" iconClass="d-icon_heart" />
        <Hotkey title="Dislike" iconClass="d-icon_circle-crossed" />
        <Hotkey title="Play" iconClass="d-icon_play" />
        <Hotkey title="Pause" iconClass="d-icon_pause" />
        <Hotkey title="Next Track" iconClass="d-icon_track-next" />
        <Hotkey title="Previous Track" iconClass="d-icon_track-prev" />
        <Hotkey title="Mute / Unmute" iconClass="d-icon_volume-mute" />
        <Hotkey title="Play / Pause" iconClass="d-icon_play" />
      </div>
    </div>
    <div class="action-buttons">
      <a
        class="d-button deco-button d-button_rounded d-button_size_M page-settings--account__edit-btn"
        type="button"
      >
        <span class="d-button-inner deco-button-stylable">
          <span class="d-button__inner">
            <span class="d-button__label">Cancel</span>
          </span>
        </span>
      </a>
      <a
        class="d-button deco-button d-button_rounded d-button_size_M page-settings--account__edit-btn"
        type="button"
        style="margin-left:10px"
      >
        <span class="d-button-inner deco-button-stylable save">
          <span class="d-button__inner">
            <span class="d-button__label">Save</span>
          </span>
        </span>
      </a>
    </div>
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

<style>
.theme-white.page-settings {
  padding: 20px;
}
.page-settings .page-settings__block {
  padding-bottom: 14px;
}
.page-settings__block .page-settings__line {
  flex-direction: inherit;
  align-items: center;
  padding: 10px 0 9px;
}
.page-settings__line .page-settings__line-control {
  margin-top: 0;
}
.page-settings__block .page-settings__subtitle {
  margin: 10px 0 10px;
}
.page-settings__block .page-settings__line {
  padding: 0 30px;
  width: 400px;
}
.hotkeys {
  display: flex;
  flex-wrap: wrap;
}
.save {
  background-color: #ffdb4d !important;
  border-color: #ffdb4d !important;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
}
</style>