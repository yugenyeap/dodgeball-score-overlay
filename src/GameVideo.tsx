import {
    AbsoluteFill,
    OffthreadVideo,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

import matchData from "./data/match-data.json";
import { Scoreboard } from "./Scoreboard";

type GameVideoProps = {
    videoFile: string;
    clipStartTime: number;
};

export const GameVideo = ({
    videoFile,
    clipStartTime,
}: GameVideoProps) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Time within current clip
    const clipTime = frame / fps;

    // Absolute time since recording started
    const currentTime = clipStartTime + clipTime;

    const currentMatch = matchData.matches.find(
        (match) =>
            currentTime >= match.start &&
            currentTime <= match.end
    );

    //debugging
    if (frame === 0) {
        console.log("DEBUG");
        console.log({
            videoFile,
            clipStartTime,
            currentTime,
            matchCount: matchData.matches.length,
            firstMatch: matchData.matches[0],
            currentMatch,
        });
    }

    const currentScore =
        currentMatch?.events
            .filter(
                (event) =>
                    event.time <= currentTime
            )
            .pop();

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile(videoFile)}
            />

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