<script lang="ts">
    import { Canvas, Layer, type Render } from 'svelte-canvas';

    let x = 0;
    let y = 0;

    let boxSize = 50;

    let width: number;
    let height: number;

    type Vector = [x: number, y: number];

    const map = new Map<Vector, boolean>();
    
    let render: Render;
    $: render = ({ context, width, height }) => {
        context.fillStyle = 'white';
        for (let i = 0; i < width / boxSize; i++) {
            for (let j = 0; j < height / boxSize; j++) {
                const x = i * boxSize;
                const y = j * boxSize;
                if (map.has([x, y])) {
                    context.fillRect(x, y, boxSize, boxSize);
                } else {
                    context.strokeRect(x, y, boxSize, boxSize);
                }
            }
        }
    };
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Canvas {width} {height}>
    <Layer {render} />
</Canvas>

<style>
    :global(canvas) {
        width: 100%;
        height: 100%;
    }
</style>