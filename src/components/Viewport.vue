<template>
  <canvas v-show="!isLoading" v-bind="$attrs" ref="canvas" />
  <slot v-if="isLoading"></slot>
</template>

<script>
import { useViewport } from "@/use/viewport";

export default {
  name: "Viewport",
  props: {
    hdr: {
      type: String,
      required: true,
    },
    models: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      const { scene, loadHdr, loadModel, frameObject } = useViewport(
        this.$refs.canvas
      );
      this.isLoading = true;
      await loadHdr(this.hdr);
      await Promise.all(
        this.models.map(async (uri) => {
          await loadModel(uri);
        })
      );
      frameObject(scene);
      this.isLoading = false;
    },
  },
};
</script>
