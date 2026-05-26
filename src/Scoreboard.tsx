import { Img, staticFile } from "remotion";
import { logoConfig } from "./config/logoConfig";

type ScoreboardProps = {
  redTeam: string;
  blueTeam: string;

  redScore: number;
  blueScore: number;
};

export const Scoreboard = ({
  redTeam,
  blueTeam,
  redScore,
  blueScore,
}: ScoreboardProps) => {

  const redTeamConfig =
    logoConfig[redTeam] ?? {
      scale: 1,
      xOffset: -25,
      yOffset: 0,
    };

  const blueTeamConfig =
    logoConfig[blueTeam] ?? {
      scale: 1,
      xOffset: -25,
      yOffset: 0,
    };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",

        display: "flex",
        alignItems: "stretch",

        fontFamily: "Arial, sans-serif",
        color: "white",

        overflow: "visible",
      }}
    >
      {/* RED TEAM */}

      <div
        style={{
          position: "relative",

          display: "flex",
          alignItems: "center",
          gap: 16,

          background:
            "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",

          padding: "18px 28px 18px 90px",

          minWidth: 280,
        }}
      >
        <Img
          src={staticFile(redTeamConfig.logo)}
          style={{
            position: "absolute",

            width: 300 * redTeamConfig.scale,
            height: 300 * redTeamConfig.scale,

            objectFit: "contain",

            left: redTeamConfig.xOffset,
            top: "50%",

            transform: `translateY(calc(-50% + ${redTeamConfig.yOffset}px))`,

            zIndex: 10,

            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {redTeam}
          </span>
        </div>
      </div>

      {/* SCORE SECTION */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,

          backgroundColor: "#111827",

          padding: "0 36px",

          minWidth: 240,

          zIndex: 5,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            width: 60,
            textAlign: "center",
          }}
        >
          {redScore}
        </span>

        <span
          style={{
            fontSize: 40,
            opacity: 0.6,
            fontWeight: 700,
          }}
        >
          -
        </span>

        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            width: 60,
            textAlign: "center",
          }}
        >
          {blueScore}
        </span>
      </div>

      {/* BLUE TEAM */}

      <div
        style={{
          position: "relative",

          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 16,

          background:
            "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",

          padding: "18px 90px 18px 28px",

          minWidth: 280,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {blueTeam}
          </span>
        </div>

        <Img
          src={staticFile(blueTeamConfig.logo)}
          style={{
            position: "absolute",

            width: 300 * blueTeamConfig.scale,
            height: 300 * blueTeamConfig.scale,

            objectFit: "contain",

            right: blueTeamConfig.xOffset,
            top: "50%",

            transform: `translateY(calc(-50% + ${blueTeamConfig.yOffset}px))`,

            zIndex: 10,

            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
          }}
        />
      </div>
    </div>
  );
};