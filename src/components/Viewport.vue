<template>
  <canvas v-show="!isLoading" v-bind="$attrs" ref="canvas" />
  <slot v-if="isLoading"></slot>
</template>

<script>
import { toRefs, ref, onMounted } from "vue";
import { useViewport } from "@/use/viewport";

export default {
  props: {
    hdr: {
      type: String,
      required: true,
    },
    models: {
      type: Array,
    },
  },
  setup(props) {
    const { hdr, models } = toRefs(props);
    const canvas = ref(null);
    const isLoading = ref(false);

    onMounted(async () => {
      const { scene, loadHdr, loadModel, frameObject } = useViewport(
        canvas.value
      );
      isLoading.value = true;
      await loadHdr(hdr.value);
      await Promise.all(
        models.value.map(async (uri) => {
          await loadModel(uri);
        })
      );
      frameObject(scene);
      isLoading.value = false;
    });

    return { canvas, isLoading };
  },
};
</script>
