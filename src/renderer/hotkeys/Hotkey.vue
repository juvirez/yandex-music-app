<template>
  <div class="page-settings__line page-settings--social-control deco-border typo">
    <div class="page-settings__line-label-container">
      <div class="d-bubble">
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
                class="d-input__field deco-input d-input__field_size-M deco-input_transparent"
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
import { defineComponent } from "vue";
import { acceleratorToHumanReadable, keyCodeToAccelerator } from "./utils";

export default defineComponent({
  props: {
    id: String,
    title: String,
    iconClass: String,
    hotkey: String,
  },
  data() {
    return {
      pressingKeys: [],
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
        this.$emit("hotkeyChanged", this.pressingKeys.slice());
      }
    },
    clear() {
      this.pressingKeys = [];
      this.$emit("hotkeyChanged", []);
    }
  },
  computed: {
    hotkeyString() {
      return this.hotkey.map(acceleratorToHumanReadable).join(" + ");
    }
  }
});

function arrayContainsAll(array, contains) {
  return contains.every(element => {
    return array.includes(element);
  });
}
</script>

<style>
.d-suggest .d-input_suggest .d-input__field {
  width: 200px;
  border-color: rgba(255, 255, 255, 0.2);
}
body .d-icon_go-forward-5sec {
  mask-image: url('static/goforward.5.svg');
  -webkit-mask-image: url('static/goforward.5.svg');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
body .d-icon_go-backward-5sec {
  mask-image: url('static/gobackward.5.svg');
  -webkit-mask-image: url('static/gobackward.5.svg');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}

@media (prefers-color-scheme: light) {
  .d-icon_go-forward-5sec, .d-icon_go-backward-5sec {
    background-color: #222;
  }
}
@media (prefers-color-scheme: dark) {
  .d-icon_go-forward-5sec, .d-icon_go-backward-5sec {
    background-color: #fff;
  }
}
</style>
