export type Vec3 = [number, number, number];

export const journeyState = { active: true };

export function moon1Center(time: number): Vec3 {
  const t = time * 0.22 + 2.0;
  return [Math.cos(t) * 5.6, Math.sin(t * 0.7) * 1.1, Math.sin(t) * 5.6 * 0.55];
}

export function moon2Center(time: number): Vec3 {
  const t = -time * 0.15 + 0.7;
  return [
    Math.cos(t) * 7.1,
    Math.sin(t * 0.9 + 1.0) * 1.4,
    Math.sin(t) * 7.1 * 0.55,
  ];
}

const offset =
  (fn: (time: number) => Vec3, d: Vec3) =>
  (time: number): Vec3 => {
    const [x, y, z] = fn(time);
    return [x + d[0], y + d[1], z + d[2]];
  };

type Waypoint = {
  p: number;
  pos: (time: number) => Vec3;
  look: (time: number) => Vec3;
};

const ORIGIN: Vec3 = [0, 0, 0];

const WAYPOINTS: Waypoint[] = [
  { p: 0, pos: () => [0, 0, 9.5], look: () => ORIGIN },
  { p: 0.16, pos: () => [0, 0, 4.0], look: () => ORIGIN },
  { p: 0.3, pos: () => [0, 0, 0.2], look: () => [0, 0, -6] },
  { p: 0.46, pos: () => [0, 0, -5.2], look: moon1Center },
  { p: 0.6, pos: offset(moon1Center, [1.7, 0.7, 2.4]), look: moon1Center },
  { p: 0.68, pos: offset(moon1Center, [-1.2, 0.4, 2.6]), look: moon1Center },
  { p: 0.8, pos: offset(moon2Center, [-1.5, 0.6, 2.2]), look: moon2Center },
  { p: 0.88, pos: offset(moon2Center, [1.0, 0.8, 2.8]), look: moon2Center },
  { p: 1, pos: () => [0, 2.6, 12.0], look: () => ORIGIN },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export function cameraState(progress: number, time: number) {
  const p = clamp01(progress);
  let i = 0;
  while (i < WAYPOINTS.length - 2 && p > WAYPOINTS[i + 1].p) i++;
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
  return {
    pos: lerp3(a.pos(time), b.pos(time), t),
    look: lerp3(a.look(time), b.look(time), t),
  };
}

export function tunnelAmount(progress: number) {
  const rampIn = smooth(clamp01((progress - 0.13) / 0.07));
  const rampOut = smooth(clamp01((progress - 0.36) / 0.08));
  return rampIn * (1 - rampOut);
}
