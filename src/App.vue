<template>
  <div class="flex">
    <viewport class="h-96 w-96" :hdr="hdr" :model="model">
      <div class="h-96 w-96 flex items-center justify-center">loading</div>
    </viewport>
  </div>
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
    const model =
      "https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf";
    return { hdr, model };
  },
};
</script>
