/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

/**
 * Component where user can scratch away an image to reveal a different image.
 */
export default function Scratch({
  topImage,
  bottomImage,
  ...props
}: {
  topImage: string;
  bottomImage: string;
} & ComponentPropsWithoutRef<"div">) {
  const [ref, bounds] = useMeasure();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;

  const randomization = 10;
  const [minWidth, maxWidth] = [1, 40];

  useEffect(() => {
    if (canvas === null) return;
    let url = topImage;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      let img = new Image();
      img.src = url;
      img.onload = function () {
        let width = bounds.width;
        let height = bounds.height;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      };

      let isPress = false;
      let old: { x: number; y: number } | null = null;
      canvas.addEventListener("mousedown", function (e) {
        isPress = true;
        old = { x: e.offsetX, y: e.offsetY };
      });
      canvas.addEventListener("touchstart", function (e) {
        isPress = true;
        old = {
          x: e.touches[0].clientX - bounds.x,
          y: e.touches[0].clientY - bounds.y,
        };
      });
      canvas.addEventListener("mousemove", function (e) {
        if (isPress && old !== null) {
          let x = e.offsetX;
          let y = e.offsetY;
          ctx.globalCompositeOperation = "destination-out";

          for (let i = 1; i <= 4; i++) {
            ctx.lineWidth = minWidth / i + Math.random() * (maxWidth / i);
            // ctx.closePath();
            ctx.moveTo(
              old.x + randomization * (Math.random() - 0.5),
              old.y + randomization * (Math.random() - 0.5)
            );
            ctx.lineTo(
              x + randomization * (Math.random() - 0.5),
              y + randomization * (Math.random() - 0.5)
            );
            ctx.stroke();
          }
          old = { x: x, y: y };
        }
      });
      canvas.addEventListener("touchmove", function (e) {
        if (isPress && old !== null) {
          let x = e.touches[0].clientX - bounds.x;
          let y = e.touches[0].clientY - bounds.y;
          ctx.globalCompositeOperation = "destination-out";

          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill();

          ctx.lineWidth = 100;
          ctx.beginPath();
          ctx.moveTo(old.x, old.y);
          ctx.lineTo(x, y);
          ctx.stroke();

          old = { x: x, y: y };
        }
      });
      canvas.addEventListener("mouseup", function (e) {
        isPress = false;
      });
      canvas.addEventListener("touchend", function (e) {
        isPress = false;
      });
    }
  }, [canvas, topImage, bounds]);

  return (
    <div
      {...props}
      css={css`
        /*
         * Make canvas and img fill the container and put canvas in front of img.
         */
        display: flex;
        /* flex-direction: column; */
        align-items: center;
        justify-content: center;
        position: relative;
        width: ${bounds.width}px;
        height: ${bounds.height}px;
        max-width: 500px;
        max-height: 500px;
        overflow: hidden;

        canvas {
          position: absolute;
          /* top: 0;
          left: 0;
          width: 100%;
          height: 100%; */
          z-index: 1;
          /* b&w */
          filter: grayscale(100%);
        }

        img {
          position: absolute;
          /* top: 0;
          left: 0;
          width: 100%;
          height: 100%; */
          z-index: -1;
        }
      `}
    >
      <img src={bottomImage} ref={ref} />
      <canvas ref={canvasRef} />
    </div>
  );
}
