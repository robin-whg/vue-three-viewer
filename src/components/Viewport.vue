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
      required: false,
    },
    model: {
      type: String,
      requried: false,
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
      if (this.model) {
        await loadModel(this.model);
      }
      if (this.models) {
        await Promise.all(
          this.models.map(async (uri) => {
            await loadModel(uri);
          })
        );
      }
      frameObject(scene);
      this.isLoading = false;
    },
  },
};
</script>
