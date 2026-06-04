import { Composition } from "remotion";
import { GameVideo } from "./GameVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="GameVideo"
        component={GameVideo}
        durationInFrames={30 * 60 * (4 * 60 + 10)} //30 fps * 60 seconds * (4 minutes + 10 seconds)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};