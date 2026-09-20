# ADR 003: 3D WebGL Background Rendering and Performance Budget

## Status
Accepted

## Context
The user experience demands an ambient 3D museum background that runs smoothly at 60 FPS across laptops, desktops, and mobile devices without occluding readability or causing high GPU power drain.

## Decision
- Three.js WebGL scene implemented with `@react-three/fiber` and `@react-three/drei`.
- Double-sided material rendering (`THREE.DoubleSide`) to prevent black clipping during orbital rotation.
- Clamped device pixel ratio `dpr={[1, 2]}` to prevent throttling on high-DPI displays.
- Non-blocking asynchronous GLTF model preloading and resource cleanup.
