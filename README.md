# THREE VIEWER

An unstyled Vue 3 component to show GTLF files in the browser. (No Vue 2 support)

## Features

- Unstyled
- Render on Demand (no continuous render loop)
- Automatically frames objects in the scene to the right size
- Pass multiple GLTF files
- Use HDR for lighting
- Support for GLTF, GLB and draco compressed GLTF files

## Basic example

```js
<template>
    <viewport class="h-screen w-screen" :hdr="hdr" :models="models">
        <!-- default slot for loading screen -->
        <div class="h-screen w-screen flex items-center justify-center">loading...</div>
    </viewport>
</template>

<script>
import Viewport from "three-viewer"

export default {
  components: {
    Viewport,
  },
  setup() {
    const hdr = '...'
    const models = [
      "...", 
    ];

    return { hdr, models };
  },
};
</script>

```