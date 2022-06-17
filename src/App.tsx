/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react/macro";
import { Center } from "@mantine/core";
// @ts-ignore

import Scratch from "./Scratch";
import img1 from "./graffiti-1.png";
import img2 from "./graffiti-2.png";

function App() {
  return (
    <>
      <Global
        styles={css`
          html,
          body,
          #root {
            margin: 0;
            padding: 0;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
          }
          div,
          img {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          .unselectable {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}
      />
      <Center
        className="unselectable"
        css={css`
          width: 100%;
          height: 100%;

          /* Gradient */
          background: linear-gradient(
            to bottom,
            rgba(0, 235, 219, 0.5) 0%,
            rgba(231, 77, 255, 0.5) 100%
          );

          position: relative;
          z-index: 0;
        `}
      >
        <Scratch
          topImage={img1}
          bottomImage={img2}
          css={css`
            transition: all 0.6s ease;
            overflow: hidden;
            border-radius: 0.5em;

            box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.2);
            &:active {
              transition: all 0.1s ease;
              box-shadow: 0 0.175em 0.375em rgba(0, 0, 0, 0.2);
            }
          `}
        />
      </Center>
    </>
  );
}

export default App;
