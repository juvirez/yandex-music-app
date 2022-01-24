<template>
  <div class="page-settings__line page-settings--social-control deco-border typo">
    <div class="page-settings__line-label-container">
      <div class="d-bubble deco-bubble">
        <span class="d-icon deco-icon" v-bind:class="[iconClass]"></span>
      </div>
      <div class="page-settings__line-label">{{ title }}</div>
    </div>
    <div class="page-settings__line-control">
      <div class="page-settings--social-control__control">
        <span class="page-settings--social-control__bind social-bind">
          <div class="d-suggest">
            <div class="d-input deco-input-wrapper d-input_size-M d-input_suggest d-suggest__input">
              <input
                @keyup="keyup"
                @keydown="keydown"
                :value="hotkeyString"
                type="text"
                readonly
                class="d-input__field deco-input"
              />
              <button
                @click="clear"
                v-if="hotkey.length > 0"
                class="d-button deco-button deco-button-flat d-button_type_flat d-button_w-icon d-button_w-icon-centered suggest-button"
              >
                <span class="d-button-inner deco-button-stylable">
                  <span class="d-button__inner">
                    <span class="d-icon deco-icon d-icon_cross-medium"></span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import settings from "electron-settings";
import { acceleratorToHumanReadable, keyCodeToAccelerator } from "./utils";

export default {
  props: {
    id: String,
    title: String,
    iconClass: String
  },
  data() {
    return {
      pressingKeys: [],
      hotkey: settings.getSync(`hotkeys.${this.id}`, [])
    };
  },
  methods: {
    keyup(event) {
      const key = keyCodeToAccelerator(event.code);
      const index = this.pressingKeys.indexOf(key);
      if (index >= 0) {
        this.pressingKeys.splice(index, 1);
      }
    },
    keydown(event) {
      const key = keyCodeToAccelerator(event.code);
      if (!this.pressingKeys.includes(key)) {
        this.pressingKeys.push(key);
      }
      if (arrayContainsAll(this.pressingKeys, this.hotkey)) {
        this.hotkey = this.pressingKeys.slice();
        this.$emit("hotkeyChanged");
      }
    },
    clear() {
      this.pressingKeys = [];
      this.hotkey = [];
      this.$emit("hotkeyChanged");
    }
  },
  computed: {
    hotkeyString() {
      return this.hotkey.map(acceleratorToHumanReadable).join(" + ");
    }
  }
};

function arrayContainsAll(array, contains) {
  return contains.every(element => {
    return array.includes(element);
  });
}
</script>

<style>
.d-suggest .d-input_suggest .d-input__field {
  width: 200px;
}
</style>
