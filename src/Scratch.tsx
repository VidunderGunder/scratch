/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";
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
  const [bottomImageRef, bottomImageBounds] = useMeasure();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;

  useEffect(() => {
    if (canvas) {
      let url = topImage;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        let img = new Image();
        img.src = url;
        img.onload = function () {
          let width = bottomImageBounds.width;
          let height = bottomImageBounds.height;

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
        canvas.addEventListener("mousemove", function (e) {
          if (isPress && old !== null) {
            let x = e.offsetX;
            let y = e.offsetY;
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
      }
    }
  }, [canvas, topImage, bottomImageBounds]);

  return (
    <div
      {...props}
      ref={ref}
      css={css`
        /*
         * Make canvas and img fill the container and put canvas in front of img.
         */
        display: flex;
        /* flex-direction: column; */
        align-items: center;
        justify-content: center;
        position: relative;
        width: ${bottomImageBounds.width}px;
        height: ${bottomImageBounds.height}px;
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
      <img src={bottomImage} ref={bottomImageRef} />
      <canvas ref={canvasRef} />
    </div>
  );
}
