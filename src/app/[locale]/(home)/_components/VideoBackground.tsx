'use client';

export function VideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        src="/video/video1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />
    </div>
  );
}
