<script lang="ts">
	import { Cell, cellToColor, flipCell, cycleColor } from '$lib/cell';
	import { Canvas, Layer, type Render } from 'svelte-canvas';

	let x = 0;
	let y = 0;

	let mouseDown = false;
	let dragging = false;

	let boxSize = 50;

	let width: number;
	let height: number;

	type Vector = [x: number, y: number];

	let map: Map<string, Cell> = new Map();

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

                const activeCell = map.get(JSON.stringify([xCoord, yCoord])) ?? Cell.Disabled;
				const color = cellToColor(activeCell);

				if (activeCell) {
					context.fillStyle = color;
					context.fillRect(xPos, yPos, boxSize, boxSize);
				} else {
					context.fillStyle = color;
                    context.strokeStyle = 'gray';
					context.strokeRect(xPos, yPos, boxSize, boxSize);
				}

				// draw the coords
                if (boxSize > 35) {
                    context.fillStyle = activeCell == Cell.Disabled ? 'gray' : 'white';
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
	on:mouseup={({ offsetX, offsetY, altKey, shiftKey }) => {
		mouseDown = false;
		if (!dragging) {
			const [xCoord, yCoord] = screenToMap(offsetX, offsetY);
			const foundCell = map.get(JSON.stringify([xCoord, yCoord])) ?? Cell.Disabled;
			map.set(
				JSON.stringify([xCoord, yCoord]),
				altKey ? cycleColor(foundCell, shiftKey) : flipCell(foundCell)
			);
			map = map;
		}
		dragging = false;
	}}
/>

<Canvas {width} {height} on:contextmenu={event => event.preventDefault()}>
	<Layer {render} />
</Canvas>

<style>
	:global(canvas) {
		width: 100%;
		height: 100%;
	}
</style>
