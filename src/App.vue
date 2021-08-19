<template>
  <viewport :hdr="hdr" :models="models" />
</template>

<script>
import Viewport from "./components/Viewport.vue";

export default {
  components: {
    Viewport,
  },
  setup() {
    const hdr =
      "https://firebasestorage.googleapis.com/v0/b/gs-waermesysteme.appspot.com/o/hdrs%2Fstudio_hdr_1k.hdr?alt=media&token=d3e142a1-dd28-487a-8a2f-2c888a3205b5";
    const models = [
      "https://firebasestorage.googleapis.com/v0/b/gs-waermesysteme.appspot.com/o/models%2Fmonkey.gltf?alt=media&token=f7e080d5-acaf-47c1-9bd4-4e23380cb393",
    ];
    return { hdr, models };
  },
};
</script>
