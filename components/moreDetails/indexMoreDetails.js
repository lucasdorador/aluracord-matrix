import { Box, Image } from "@skynexui/components";
import appConfig from "../../config.json";

export default function MoreDetails(props) {
  return (
    <Box
      styleSheet={{
        display: "flex",
        flexDirection: "column",
        width: "250px",
        height: "100px",
        top: `${props.top}px`,
        left: `${props.left}px`,
        position: "absolute",
        borderRadius: "10px",
        backgroundColor: appConfig.theme.colors.primary["900"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Image
          id="imageAccount"
          styleSheet={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "inline-block",
            position: "relative",
            marginLeft: "8px",
            marginTop: "5px",
          }}
          src={`https://github.com/${props.userName}.png`}
        />
        <button
          style={{
            width: "20px",
            height: "20px",
            marginRight: "5px",
            marginTop: "5px",
            background: "white",
            color: "red",
            cursor: "pointer",
          }}
          onClick={() => {
            props.cbCloseMoreDetail({
              state: false,
              alignX: "0",
              alignY: "0",
            });
          }}
        >
          X
        </button>
      </Box>
      <Box
        styleSheet={{
          display: "flex",
          marginLeft: "8px",
          marginTop: "2px",
        }}
      >
        <a
          style={{
            color: "white",
          }}
          target={"_blank"}
          href={`https://github.com/${props.userName}`}
        >
          {props.userName} (Github)
        </a>
      </Box>
    </Box>
  );
}
