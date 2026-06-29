const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const RAW_DIR = "raw";
const PUBLIC_DIR = "public";
const CHUNK_SECONDS = 300; // 5 minutes

async function ffprobe(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
}

async function transcodeAndChunk(input, outputPattern) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .videoCodec("h264_nvenc")
      .audioCodec("aac")
      .outputOptions([
        "-cq 28",
        "-preset p4",
        "-pix_fmt yuv420p",
        `-segment_time ${CHUNK_SECONDS}`,
        "-f segment",
        "-reset_timestamps 1",
      ])
      .on("start", (cmd) => {
        console.log("\nFFmpeg Started");
        console.log(cmd);
      })
      .on("progress", (progress) => {
        if (progress.percent) {
          process.stdout.write(
            `\r${progress.percent.toFixed(1)}%`
          );
        }
      })
      .on("end", () => {
        process.stdout.write("\n");
        resolve();
      })
      .on("error", reject)
      .save(outputPattern);
  });
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
  }

  const files = fs
    .readdirSync(RAW_DIR)
    .filter((f) =>
      f.toLowerCase().endsWith(".mp4")
    )
    .sort();

  const metadata = {
    recordingStartedAt: null,
    clips: [],
  };

  let runningTime = 0;
  let chunkNumber = 1;

  for (const file of files) {
    const input = path.join(
      RAW_DIR,
      file
    );

    console.log(
      `\nProcessing ${file}`
    );

    const probe =
      await ffprobe(input);

    const creationTime =
      probe.format.tags?.creation_time;

    if (
      !metadata.recordingStartedAt &&
      creationTime
    ) {
      metadata.recordingStartedAt =
        Math.floor(
          new Date(
            creationTime
          ).getTime() / 1000
        );
    }

    const tempPattern = path.join(
      PUBLIC_DIR,
      "temp-%03d.mp4"
    );

    await transcodeAndChunk(
      input,
      tempPattern
    );

    const chunks = fs
      .readdirSync(PUBLIC_DIR)
      .filter((f) =>
        f.startsWith("temp-")
      )
      .sort();

    for (const chunk of chunks) {
      const oldPath =
        path.join(
          PUBLIC_DIR,
          chunk
        );

      const newName =
        `chunk-${String(
          chunkNumber
        ).padStart(3, "0")}.mp4`;

      const newPath =
        path.join(
          PUBLIC_DIR,
          newName
        );

      fs.renameSync(
        oldPath,
        newPath
      );

      const chunkProbe =
        await ffprobe(newPath);

      const duration =
        chunkProbe.format
          .duration;

      metadata.clips.push({
        file: newName,
        startTime:
          runningTime,
        duration,
      });

      runningTime +=
        duration;

      chunkNumber++;
    }
  }

  fs.writeFileSync(
    path.join(
      "src",
      "data",
      "metadata.json"
    ),
    JSON.stringify(
      metadata,
      null,
      2
    )
  );

  console.log(
    "\nCreated metadata.json"
  );

  console.log(
    `Generated ${metadata.clips.length} chunks`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});