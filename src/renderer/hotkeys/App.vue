<template>
  <div class="page-settings">
    <div class="page-settings__block">
      <h2 class="page-settings__subtitle typo-h2_bold">Global Hotkeys</h2>
      <div class="hotkeys">
        <Hotkey
          ref="hotkeys"
          v-for="hotkey in hotkeys"
          :key="hotkey.id"
          :id="hotkey.id"
          :title="hotkey.title"
          :iconClass="hotkey.icon"
          :hotkey="savedHotkeys[hotkey.id] || []"
          @hotkeyChanged="(newHotkey) => onHotkeyChanged(hotkey.id, newHotkey)"
        />
      </div>
    </div>
    <div class="action-buttons">
      <a
        @click="cancel"
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
        @click="save"
        :class="{ disabled: !hasChangedHotkey }"
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
import { defineComponent, toRaw } from "vue";
import Hotkey from "./Hotkey.vue";
import { ipcRenderer } from "electron";

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    window.close();
  }
});

export default defineComponent({
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
          icon: "d-icon_track-prev",
        },
        {
          id: "mute_unmute",
          title: "Mute / Unmute",
          icon: "d-icon_volume-mute",
        },
        { id: "play_pause", title: "Play / Pause", icon: "d-icon_play" },
        { id: "like_unlike", title: "Like / Unlike", icon: "d-icon_heart" },
        { id: "track_info", title: "Track Info", icon: "d-icon_notes" },
        { id: "volume_down", title: "Volume Down", icon: "d-icon_volume-quiet" },
        { id: "volume_up", title: "Volume Up", icon: "d-icon_volume-sprite" },
      ],
      hasChangedHotkey: false,
      savedHotkeys: {},
    };
  },
  async beforeCreate() {
    this.savedHotkeys = await ipcRenderer.invoke('getStoreValue', `hotkeys`, {});
  },
  methods: {
    async save() {
      if (!this.hasChangedHotkey) {
        return;
      }
      this.hotkeys.forEach(async (hotkey) => {
        console.log(hotkey.id, toRaw(this.savedHotkeys[hotkey.id]));
        await ipcRenderer.invoke('setStoreValue', `hotkeys.${hotkey.id}`, toRaw(this.savedHotkeys[hotkey.id]) ?? []);
      });
      window.close();
    },
    cancel() {
      window.close();
    },
    onHotkeyChanged(id, newHotkey) {
      this.hasChangedHotkey = true;
      this.savedHotkeys[id] = newHotkey;
    },
  },
});
</script>

<style>
.page-settings {
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
  margin: 10px 40px 20px;
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
@media (prefers-color-scheme: dark) {
  .save .d-button__label {
    color: black;
  }
  .d-button.disabled .save .d-button__label {
    color: rgba(0,0,0,0.2);
  }
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
