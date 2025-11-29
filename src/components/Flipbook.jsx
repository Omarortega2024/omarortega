import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const images = Array.from({ length: 18 }, (_, i) =>
  `https://cdn.omarortegamx.com.mx/flipbook-${i + 1}-ooa.jpg`
);

const flipSound = new Audio(
  "https://cdn.omarortegamx.com.mx/sonido-revista-final.MP3"
);
flipSound.preload = "auto";

const Page = React.forwardRef(({ src, number, density, cover }, ref) => (
  <div
    ref={ref}
    data-density={density || "soft"}
    data-cover={cover || false} // marca portada
    style={{
      width: "100%",
      height: "100%",
      padding: "12px",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      background: "white",
      borderRadius: "6px",
      boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
      position: "relative",
    }}
  >
    <img
      src={src}
      alt={`Página ${number}`}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </div>
));

export default function FlipbookReact() {
  const flipBookRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const playFlipSound = () => {
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});
  };

  const goNext = () => flipBookRef.current?.getPageFlip().flipNext();
  const goPrev = () => flipBookRef.current?.getPageFlip().flipPrev();

  const handlePageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) goNext();
    else goPrev();
  };

  useEffect(() => {
    const enableAudio = () => {
      flipSound.play().then(() => flipSound.pause());
      window.removeEventListener("click", enableAudio);
    };
    window.addEventListener("click", enableAudio);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        background: "#f0f0f0",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <HTMLFlipBook
        width={isMobile ? 300 : 400}
        height={isMobile ? 400 : 518}
        showCover={true} // necesario para portada
        mobileScrollSupport={false}
        usePortrait={isMobile}
        drawShadow={true}
        maxShadowOpacity={0.8}
        flippingTime={1000}
        size="stretch"
        ref={flipBookRef}
        onFlip={playFlipSound}
        className="flipbook"
        onClick={handlePageClick}
      >
        {/* Primera página como portada blanda */}
        <Page src={images[0]} number={1} density="soft" cover={true} />
        {/* Páginas internas */}
        {images.slice(1).map((img, idx) => (
          <Page key={idx + 1} src={img} number={idx + 2} />
        ))}
      </HTMLFlipBook>
    </div>
  );
}
