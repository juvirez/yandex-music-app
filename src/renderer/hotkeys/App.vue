<template>
  <div class="theme-white icon-theme-white page-settings">
    <div class="page-settings__block">
      <h2 class="page-settings__subtitle typo-h2_bold">Global Hotkeys</h2>
      <div class="hotkeys">
        <Hotkey
          v-for="hotkey in hotkeys"
          :key="hotkey.id"
          :title="hotkey.title"
          :iconClass="hotkey.icon"
        />
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
      hotkeys: [
        { id: "love", title: "Love", icon: "d-icon_heart" },
        { id: "dislike", title: "Dislike", icon: "d-icon_circle-crossed" },
        { id: "play", title: "Play", icon: "d-icon_play" },
        { id: "pause", title: "Pause", icon: "d-icon_pause" },
        { id: "next_track", title: "Next Track", icon: "d-icon_track-next" },
        {
          id: "previous_track",
          title: "Previous Track",
          icon: "d-icon_track-prev"
        },
        {
          id: "mute_unmute",
          title: "Mute / Unmute",
          icon: "d-icon_volume-mute"
        },
        { id: "play_pause", title: "Play / Pause", icon: "d-icon_play" }
      ]
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