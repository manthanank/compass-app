export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function lowPassFilter(current: number, previous: number, alpha = 0.2): number {
  let diff = current - previous;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;
  return normalizeAngle(previous + alpha * diff);
}
