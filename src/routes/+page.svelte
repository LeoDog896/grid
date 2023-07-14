<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';

	let x = 0;
	let y = 0;

	let mouseDown = false;
	let dragging = false;

	let boxSize = 50;

	let width: number;
	let height: number;

	type Vector = [x: number, y: number];

	const map: Record<string, boolean> = {};

	function screenToMap(xCursor: number, yCursor: number): Vector {
		return [Math.floor((xCursor - x) / boxSize), Math.floor((yCursor - y) / boxSize)];
	}

	let render: Render;
	$: render = ({ context, width, height }) => {
		for (let i = -5; i < width / boxSize + 5; i++) {
			for (let j = -5; j < height / boxSize + 5; j++) {
				let xCoord = i - (x > 0 ? Math.floor(x / boxSize) : Math.ceil(x / boxSize));
				let yCoord = j - (y > 0 ? Math.floor(y / boxSize) : Math.ceil(y / boxSize));
				const xPos = i * boxSize + (x % boxSize);
				const yPos = j * boxSize + (y % boxSize);

                const activeCell = map[JSON.stringify([xCoord, yCoord])];

				if (activeCell) {
					context.fillStyle = 'black';
					context.fillRect(xPos, yPos, boxSize, boxSize);
				} else {
					context.fillStyle = 'white';
                    context.strokeStyle = 'gray';
					context.strokeRect(xPos, yPos, boxSize, boxSize);
				}

				// draw the coords
                console.log(boxSize)
                if (boxSize > 35) {
                    context.fillStyle = activeCell ? 'white' : 'gray';
                    context.font = `${boxSize / 2}px`;
                    context.fillText(`${xCoord}, ${yCoord}`, xPos + 5, yPos + 15);
                }
			}
		}
	};
</script>

<svelte:window
	bind:innerWidth={width}
	bind:innerHeight={height}
    on:wheel={({ deltaY }) => {
        boxSize += deltaY / 100;
        boxSize = Math.min(Math.max(30, boxSize), 100);
    }} 
	on:mousedown={() => {
		mouseDown = true;
	}}
	on:mousemove={({ movementX, movementY }) => {
		if (mouseDown) {
			dragging = true;
			x += movementX;
			y += movementY;
		}
	}}
	on:mouseup={({ offsetX, offsetY }) => {
		mouseDown = false;
		if (!dragging) {
			const [xCoord, yCoord] = screenToMap(offsetX, offsetY);
			map[JSON.stringify([xCoord, yCoord])] = !map[JSON.stringify([xCoord, yCoord])];
		}
		dragging = false;
	}}
/>

<Canvas {width} {height}>
	<Layer {render} />
</Canvas>

<style>
	:global(canvas) {
		width: 100%;
		height: 100%;
	}
</style>
