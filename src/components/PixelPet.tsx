import { useEffect, useRef } from "react";
import type { PetDNA } from "../types";

const PIXEL = 6;
const W = 20;
const H = 18;

type Props = {
  dna: PetDNA;
  scale?: number;
  animate?: boolean;
  className?: string;
};

function drawPet(
  ctx: CanvasRenderingContext2D,
  dna: PetDNA,
  frame: number
) {
  const { primaryColor, accentColor, bellyColor, eyeStyle, accessory, mood } =
    dna;

  const bounce =
    mood === "energetic"
      ? Math.sin(frame * 0.12) * 1.5
      : mood === "cozy"
        ? Math.sin(frame * 0.06) * 0.5
        : Math.sin(frame * 0.08) * 1;

  const grid: (string | null)[][] = Array.from({ length: H }, () =>
    Array(W).fill(null)
  );

  const set = (x: number, y: number, color: string) => {
    const gy = Math.round(y + bounce);
    if (gy >= 0 && gy < H && x >= 0 && x < W) grid[gy][x] = color;
  };

  const fillEllipse = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    color: string
  ) => {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) {
          set(cx + x, cy + y, color);
        }
      }
    }
  };

  // Body
  fillEllipse(10, 11, 7, 6, primaryColor);
  fillEllipse(10, 12, 5, 4, bellyColor);

  // Head
  fillEllipse(10, 6, 6, 5, primaryColor);

  // Cheeks
  set(6, 7, "#ffb8c8");
  set(14, 7, "#ffb8c8");

  // Eyes
  const blink = Math.floor(frame / 90) % 5 === 0 && frame % 90 < 4;
  if (!blink) {
    if (eyeStyle === "sleepy") {
      for (let i = -1; i <= 1; i++) {
        set(7 + i, 6, accentColor);
        set(13 + i, 6, accentColor);
      }
    } else if (eyeStyle === "sparkle") {
      set(7, 5, "#fff");
      set(8, 6, accentColor);
      set(7, 7, accentColor);
      set(13, 5, "#fff");
      set(12, 6, accentColor);
      set(13, 7, accentColor);
    } else {
      set(7, 6, accentColor);
      set(8, 6, "#fff");
      set(13, 6, accentColor);
      set(12, 6, "#fff");
    }
  }

  // Mouth
  if (mood === "cozy") {
    set(10, 8, accentColor);
  } else {
    set(9, 8, accentColor);
    set(10, 8, accentColor);
    set(11, 8, accentColor);
  }

  // Feet
  set(7, 16, accentColor);
  set(8, 17, accentColor);
  set(13, 16, accentColor);
  set(12, 17, accentColor);

  // Accessory
  if (accessory === "leaf") {
    set(10, 2, "#4a8f2e");
    set(9, 3, "#7ec850");
    set(11, 3, "#7ec850");
    set(10, 4, "#4a8f2e");
  } else if (accessory === "drop") {
    set(10, 2, "#2a7fd4");
    set(10, 3, "#5eb8ff");
    set(9, 4, "#5eb8ff");
    set(11, 4, "#5eb8ff");
  } else if (accessory === "flame") {
    set(10, 2, "#ffd166");
    set(9, 3, "#ff9a6c");
    set(11, 3, "#ff9a6c");
    set(10, 4, "#e05a2b");
  } else if (accessory === "bow") {
    set(8, 3, "#ff6b9d");
    set(12, 3, "#ff6b9d");
    set(10, 3, "#ffb8c8");
  }

  // Archetype flair
  if (dna.archetype === "star") {
    set(4, 4, "#ffd166");
    set(16, 4, "#ffd166");
  }
  if (dna.archetype === "moon") {
    set(4, 5, "#d4cfff");
    set(16, 5, "#d4cfff");
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
      }
    }
  }

  // Pixel shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let x = 6; x <= 14; x++) {
    ctx.fillRect(x * PIXEL, 17 * PIXEL, PIXEL, PIXEL * 0.5);
  }
}

export function PixelPet({ dna, scale = 4, animate = true, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    const loop = () => {
      if (animate) frameRef.current += 1;
      drawPet(ctx, dna, frameRef.current);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [dna, animate]);

  const width = W * PIXEL;
  const height = H * PIXEL;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={width}
      height={height}
      style={{
        width: width * scale,
        height: height * scale,
        imageRendering: "pixelated",
      }}
      aria-label={`Pixel pet ${dna.name}`}
    />
  );
}
