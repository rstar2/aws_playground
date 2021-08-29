<template>
  <div class="fileDropContainer">
    <input type="file" @change="onSelect" :disabled="disabled" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Called when a file is selected/changed.
     * Note will be called on manual file-browse dialog selection or on drag'n'drop.
     * This is default HTML file input behaviour.
     */
    onSelect(event) {
      const file = event.target.files?.[0];
      this.$emit("select", file);
    },

  }
};
</script>>

<style scoped>
.fileDropContainer {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: #0c324e;
  color: dimgray;
  padding: 10px 10px;
  position: relative;
}

.fileDropContainer:hover {
  background: #0c324e;
}

.fileDropContainer p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

.fileDropContainer input[type="file"] {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  cursor: pointer;
}

.fileDropContainer input[type="file"]:disabled {
  cursor: default;
}
</style>
