<template>
  <div class="page-settings__line page-settings--social-control deco-border typo">
    <div class="page-settings__line-label-container">
      <div class="d-bubble deco-bubble">
        <span class="d-icon deco-icon" v-bind:class="[ iconClass ]"></span>
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
import { keyCodeToHumanReadable } from "./utils";

export default {
  props: {
    title: String,
    iconClass: String,
    onHotkeyChange: Function
  },
  data() {
    return {
      pressingKeys: [],
      hotkey: []
    };
  },
  methods: {
    keyup(event) {
      const index = this.pressingKeys.indexOf(event.code);
      if (index >= 0) {
        this.pressingKeys.splice(index, 1);
      }
    },
    keydown(event) {
      if (!this.pressingKeys.includes(event.code)) {
        this.pressingKeys.push(event.code);
      }
      if (arrayContainsAll(this.pressingKeys, this.hotkey)) {
        this.hotkey = this.pressingKeys.slice();
        this.onHotkeyChange();
      }
    },
    clear() {
      this.pressingKeys = [];
      this.hotkey = [];
      this.onHotkeyChange();
    }
  },
  computed: {
    hotkeyString() {
      return this.hotkey.map(keyCodeToHumanReadable).join(" + ");
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