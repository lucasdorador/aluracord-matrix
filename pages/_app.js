import appConfig from "../config.json";

function GlobalStyle() {
  return (
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      *::-webkit-scrollbar-track {
        background-color: ${appConfig.theme.colors.neutrals["700"]};
      }
      *::-webkit-scrollbar {
        width: 0.2rem;
        height: 0.2rem;
        background: ${appConfig.theme.colors.primary["800"]};
      }
      *::-webkit-scrollbar-thumb {
        background: ${appConfig.theme.colors.primary["700"]};
      }
      body {
        font-family: "Open Sans", sans-serif;
      }
      /* App fit Height */
      html,
      body,
      #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */
    `}</style>
  );
}

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
