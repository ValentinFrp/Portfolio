# Portfolio

Personal portfolio of Valentin Frappart, full-stack developer and ML engineer.

The site opens on a procedural world initialization: 7,600 particles assemble live into a planet, two orbiting moons and a ring, driven by custom GLSL shaders. Scrolling dissolves the system into a structured grid while the content sections animate in 3D, tied to scroll position.

## Stack

- [Next.js 16](https://nextjs.org) with the App Router, TypeScript and [Tailwind CSS 4](https://tailwindcss.com)
- [Three.js](https://threejs.org) via [react-three-fiber](https://github.com/pmndrs/react-three-fiber) for the particle scene
- [GSAP](https://gsap.com) (ScrollTrigger, SplitText, ScrambleText) for the intro sequence and scroll choreography
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/                 layout, page, global styles and design tokens
  components/
    intro/             world initialization overlay
    layout/            header, smooth scroll
    scene/             WebGL particle field (planet, moons, ring, grid morph)
    sections/          hero, capabilities, projects, contact
  content/site.ts      all copy and data, edit content here
  lib/                 shared state and scroll animation helpers
```

## Accessibility

The full experience respects `prefers-reduced-motion`: the intro is skipped and content is shown directly. The intro can also be skipped with Enter or the skip button.
