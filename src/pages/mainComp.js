import React from "react";
// Modules
import { Noise } from "noisejs";
import { useState } from "react";

const CANVAS_WIDTH = 3000;
// The amplitude. The amount the noise affects the movement.
const NOISE_AMOUNT = 5;
// The frequency. Smaller for flat slopes, higher for jagged spikes.
const NOISE_SPEED = 0.004;
// Pixels to move per frame. At 60fps, this would be 18px a sec.
const SCROLL_SPEED = 0.3;

const bubbles = [
  {
    s: 0.8,
    x: 1134,
    y: 45,
  },
  {
    s: 0.8,
    x: 1620,
    y: 271,
  },
  {
    s: 0.8,
    x: 1761,
    y: 372,
  },
  {
    s: 0.8,
    x: 2499,
    y: 79,
  },
  {
    s: 1.0,
    x: 2704,
    y: 334,
  },
  {
    s: 0.8,
    x: 2271,
    y: 356,
  },
  {
    s: 0.8,
    x: 795,
    y: 226,
  },
  {
    s: 0.8,
    x: 276,
    y: 256,
  },
  {
    s: 0.8,
    x: 1210,
    y: 365,
  },
  {
    s: 0.8,
    x: 444,
    y: 193,
  },
  {
    s: 0.8,
    x: 2545,
    y: 387,
  },
  {
    s: 1.0,
    x: 1303,
    y: 193,
  },
  {
    s: 1.0,
    x: 907,
    y: 88,
  },
  {
    s: 1.0,
    x: 633,
    y: 320,
  },
  {
    s: 1.0,
    x: 323,
    y: 60,
  },
  {
    s: 1.0,
    x: 129,
    y: 357,
  },
  {
    s: 1.0,
    x: 1440,
    y: 342,
  },
  {
    s: 1.0,
    x: 1929,
    y: 293,
  },
  {
    s: 1.0,
    x: 2135,
    y: 198,
  },
  {
    s: 1.0,
    x: 2276,
    y: 82,
  },
  {
    s: 1.0,
    x: 2654,
    y: 182,
  },
  {
    s: 1.0,
    x: 2783,
    y: 60,
  },
  {
    s: 1.2,
    x: 1519,
    y: 118,
  },
  {
    s: 1.2,
    x: 1071,
    y: 233,
  },
  {
    s: 1.2,
    x: 1773,
    y: 148,
  },
  {
    s: 1.2,
    x: 2098,
    y: 385,
  },
  {
    s: 1.2,
    x: 2423,
    y: 244,
  },
  {
    s: 1.2,
    x: 901,
    y: 385,
  },
  {
    s: 1.2,
    x: 624,
    y: 111,
  },
  {
    s: 1.2,
    x: 75,
    y: 103,
  },
  {
    s: 1.2,
    x: 413,
    y: 367,
  },
  {
    s: 1.2,
    x: 2895,
    y: 271,
  },
  {
    s: 1.2,
    x: 1990,
    y: 75,
  },
];

const noise = new Noise();

const MainComp = () => {
  const animationRef = React.useRef();
  const bubblesRef = React.useRef(
    bubbles.map((bubble) => ({
      ...bubble,
      noiseSeedX: Math.floor(Math.random() * 64000),
      noiseSeedY: Math.floor(Math.random() * 64000),
      xWithNoise: bubble.x,
      yWithNoise: bubble.y,
    }))
  );

  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 200);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  function animate() {
    bubblesRef.current = bubblesRef.current.map((bubble, index) => {
      const newNoiseSeedX = bubble.noiseSeedX + NOISE_SPEED;
      const newNoiseSeedY = bubble.noiseSeedY + NOISE_SPEED;

      const randomX = noise.simplex2(newNoiseSeedX, 0);
      const randomY = noise.simplex2(newNoiseSeedY, 0);

      const newX = bubble.x - SCROLL_SPEED;

      const newXWithNoise = newX + randomX * NOISE_AMOUNT;
      const newYWithNoise = bubble.y + randomY * NOISE_AMOUNT;

      const element = document.getElementById(`bubble-${index}`);

      if (element) {
        element.style.transform = `translate(${newXWithNoise}px, ${newYWithNoise}px) scale(${bubble.s})`;
      }

      return {
        ...bubble,
        noiseSeedX: newNoiseSeedX,
        noiseSeedY: newNoiseSeedY,
        x: newX < -200 ? CANVAS_WIDTH : newX,
        xWithNoise: newXWithNoise,
        yWithNoise: newYWithNoise,
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles">
        {bubbles.map((bubble, index) => (
          <Bubble
            bubble={bubble}
            index={index}
            key={`${bubble.x} ${bubble.y}`}
          />
        ))}
      </div>
    </div>
  );
};

const Bubble = ({ bubble, index }) => {
  const colors = ["lightblue", "fuchsia", "lightgreen", "cornflowerblue"];

  return (
    <div
      className="bubble"
      id={`bubble-${index}`}
      key={`${bubble.x} ${bubble.y}`}
      style={{
        transform: `translate(${bubble.x}px, ${bubble.y}px) scale(${bubble.s})`,
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: `${colors[Math.floor(Math.random() * 4)]}`,
        padding: "10px",
      }}
    >
      <BubbleText scale={bubble.s} key={`${bubble.x} ${bubble.y}`} />
      <button
        key={`${bubble.x} ${bubble.y}`}
        style={{
          marginLeft: "65%",
          marginRight: "5%",
          marginBottom: "10%",
          height: "15%",
          backgroundColor: "orange",
          border: "none",
          borderRadius: "10%",
          fontFamily: "Gill Sans",
        }}
      >
        SAME!
      </button>
    </div>
  );
};

export default MainComp;

const BubbleText = ({ key }) => {
  const [lows, setLows] = useState([
    "I failed my SOC midterm yesterday.",
    "I didn't get any of the 90 internships I applied to.",
    "I haven't been to the gym a single time this semester.",
    "I dropped out of BSE last semester and I still haven't found a way to tell my friends.",
    "I'm graduating in two months, and I haven't found a job or figured out where I want to live.",
    "I have a C in math and its too late to drop or pdf.",
    "I'm out of late days, and I'm too scared to ask for another extension.",
    "I missed my cousin's wedding last weekend to finish a paper and just found out I got a B- on it.",
    "I feel like I don't have any close friends at this school and I don't know how to make new ones.",
    "I applied to 46 internships this fall and didn't get a single interview.",
    "I studied for hours for COS and got a 75.",
    "There is just not enough time in the day for me to finish my assignments due midnight.",
    "My thesis advisor hated 90% of the stuff I showed him at our checkpoint meeting yesterday.",
  ]);

  const text = lows[Math.floor(Math.random() * lows.length)];

  return (
    <p
      style={{
        height: "85%",
        padding: "5%",
        fontFamily: "Gill Sans",
      }}
      key={key}
    >
      {text}
    </p>
  );
};
