<template>
  <div class="bg-gray-400">s</div>
</template>

<script>
import { toRefs } from "vue";

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
    return {};
  },
};
</script>
