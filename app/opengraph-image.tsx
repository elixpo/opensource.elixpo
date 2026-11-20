import { ImageResponse } from 'next/og';

export const alt = 'Elixpo Open Source — Run programs that ship';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        background: '#111111',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#ff7772',
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: '0.12em',
        }}
      >
        <span style={{ display: 'flex' }}>ELIXPO OPEN SOURCE</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          <span style={{ display: 'flex' }}>Run programs</span>
          <span style={{ display: 'flex' }}>that ship.</span>
        </div>
        <div style={{ display: 'flex', color: '#c4c4c4', fontSize: 28 }}>
          Contests, projects, and contributor communities.
        </div>
      </div>
      <div
        style={{
          width: 80,
          height: 8,
          borderRadius: 8,
          background: '#e53935',
        }}
      />
    </div>,
    size,
  );
}
