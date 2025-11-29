import React, { useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const images = Array.from({ length: 18 }, (_, i) =>
  `https://cdn.omarortegamx.com.mx/flipbook-${i + 1}-ooa.jpg`
);

const flipSound = new Audio(
  "https://cdn.omarortegamx.com.mx/sonido-revista-final.MP3"
);
flipSound.preload = "auto";

const Page = React.forwardRef(({ src, number, density }, ref) => (
  <div
    ref={ref}
    data-density={density || "soft"}
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      background: "white",
      borderRadius: "6px",
      boxShadow: "0 12px 12px rgba(0,0,0,0.25)", // sombra solo abajo
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

export default function FlipbookMobileFixed() {
  const flipBookRef = useRef(null);

  const playFlipSound = () => {
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});
  };

  const handlePageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const flip = flipBookRef.current?.getPageFlip();
    if (!flip) return;
    if (x > rect.width / 2) flip.flipNext();
    else flip.flipPrev();
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
        minHeight: "70vh",
        background: "#f0f0f0",
        overflow: "hidden",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <HTMLFlipBook
        width={320}
        height={480}
        size="fixed"
        drawShadow={false} // quitar shadow interno que aparece arriba
        maxShadowOpacity={0} // no dibuja sombra extra
        flippingTime={500}
        ref={flipBookRef}
        onFlip={playFlipSound}
        onClick={handlePageClick}
      >
        {images.map((img, idx) => (
          <Page
            key={idx}
            src={img}
            number={idx + 1}
            density={idx === 0 || idx === images.length == "soft"}
          />
        ))}
      </HTMLFlipBook>
    </div>
  );
}
