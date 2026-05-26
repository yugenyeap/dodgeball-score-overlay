import { Composition } from "remotion";
import { GameVideo } from "./GameVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="GameVideo"
        component={GameVideo}
        durationInFrames={30 * 60 * 3}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};