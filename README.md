# VUE THREE VIEWER

An unstyled Vue 3 component to show GTLF files as easy as possible.

## Features

- Unstyled
- Render on Demand (no continuous render loop)
- Orbit Controls
- Automatically frames objects in the scene to the right size
- Pass multiple GLTF files
- Use HDR for lighting
- Support for GLTF, GLB and draco compressed GLTF files

## Basic example with composition API

```js

<template>
    <viewport class="h-screen w-screen" :hdr="hdr" :model="model">
        <!-- default slot for loading screen -->
        <div class="h-screen w-screen flex items-center justify-center">loading...</div>
    </viewport>
</template>

<script>
import Viewport from "vue-three-viewer"

export default {
  components: {
    Viewport,
  },
  setup() {
    const hdr = '...'
    const model = '...'

    return { hdr, model };
  },
};
</script>

```
