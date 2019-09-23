<template>
  <div>
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
          class="d-button deco-button deco-button-flat d-button_type_flat d-button_w-icon d-button_w-icon-centered suggest-button"
          type="submit"
        >
          <span class="d-button-inner deco-button-stylable">
            <span class="d-button__inner">
              <span class="d-icon deco-icon d-icon_cross-medium"></span>
            </span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pressingKeys: [],
      hotkey: []
    };
  },
  methods: {
    keyup(event) {
      const index = this.pressingKeys.indexOf(event.key);
      if (index >= 0) {
        this.pressingKeys = this.pressingKeys.slice(index, 1);
      }
    },
    keydown(event) {
      if (!this.pressingKeys.includes(event.key)) {
        this.pressingKeys.push(event.key);
      }
      if (arrayContainsAll(this.pressingKeys, this.hotkey)) {
        this.hotkey = this.pressingKeys.slice();
      }
    }
  },
  computed: {
    hotkeyString() {
      return this.hotkey.join(" + ");
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