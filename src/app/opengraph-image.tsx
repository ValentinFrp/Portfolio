import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} · ${site.role}`;

const STARS = [
  { top: 60, left: 90, size: 3 },
  { top: 140, left: 320, size: 2 },
  { top: 90, left: 620, size: 3 },
  { top: 200, left: 1080, size: 2 },
  { top: 420, left: 150, size: 2 },
  { top: 540, left: 420, size: 3 },
  { top: 480, left: 1130, size: 3 },
  { top: 330, left: 560, size: 2 },
  { top: 570, left: 780, size: 2 },
  { top: 40, left: 950, size: 2 },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0a0612",
          position: "relative",
          padding: "0 90px",
        }}
      >
        {STARS.map((star, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              borderRadius: 99,
              background: "#f0eaf4",
              opacity: 0.6,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 145,
            width: 340,
            height: 340,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 35% 30%, #b98aff 0%, #a16bff 45%, #4a2683 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -30,
            top: 260,
            width: 520,
            height: 130,
            borderRadius: 999,
            border: "5px solid #e24fd8",
            opacity: 0.85,
            transform: "rotate(-16deg)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div
            style={{
              fontSize: 26,
              color: "#a16bff",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 82,
              fontWeight: 700,
              color: "#f0eaf4",
              lineHeight: 1.05,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#968ca8",
              lineHeight: 1.4,
            }}
          >
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    size
  );
}
