import {
    AbsoluteFill,
    OffthreadVideo,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

import matchData from "./data/match-data.json";
import { Scoreboard } from "./Scoreboard";

export const GameVideo = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const currentTime = frame / fps;

    const currentMatch = matchData.matches.find(
        (match) =>
            currentTime >= match.start &&
            currentTime <= match.end
    );

    const currentScore =
        currentMatch?.events
            .filter((event) => event.time <= currentTime)
            .pop();

    return (
        <AbsoluteFill>
            <OffthreadVideo src={staticFile("game.mp4")} />

            {currentMatch && (
                <Scoreboard
                    redTeam={currentMatch.redTeam}
                    blueTeam={currentMatch.blueTeam}
                    redScore={currentScore?.redTeam ?? 0}
                    blueScore={currentScore?.blueTeam ?? 0}
                />
            )}
        </AbsoluteFill>
    );
};