const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const FPS = 30;

const metadata = JSON.parse(
    fs.readFileSync(
        path.join(
            "src",
            "data",
            "metadata.json"
        ),
        "utf8"
    )
);

if (!fs.existsSync("renders")) {
    fs.mkdirSync("renders");
}

const renderedFiles = [];

for (
    let i = 0;
    i < metadata.clips.length;
    i++
) {
    const clip =
        metadata.clips[i];

    const output =
        `renders/render-${i + 1}.mp4`;

    renderedFiles.push(output);

    const durationInFrames =
        Math.ceil(
            clip.duration * FPS
        );

    const propsPath =
        `renders/props-${i + 1}.json`;

    const props = {
        videoFile: clip.file,
        clipStartTime: clip.startTime,
    };

    fs.writeFileSync(
        propsPath,
        JSON.stringify(
            props,
            null,
            2
        )
    );

    console.log("\n");
    console.log(
        "================================="
    );
    console.log(
        `Rendering ${clip.file}`
    );
    console.log(
        `Duration: ${Math.round(
            clip.duration
        )} seconds`
    );
    console.log(
        `Frames: ${durationInFrames}`
    );
    console.log(
        `Clip Start Time: ${clip.startTime.toFixed(3)} seconds`
    );
    console.log(
        "================================="
    );

    console.log(props);

    execSync(
        `npx remotion render GameVideo "${output}" --props="${propsPath}" --duration-in-frames=${durationInFrames}`,
        {
            stdio: "inherit",
        }
    );

}

console.log(
    "\nCreating concat file..."
);

const concatList =
    renderedFiles
        .map(
            (_, index) =>
                `file 'render-${index + 1}.mp4'`
        )
        .join("\n");

fs.writeFileSync(
    "renders/files.txt",
    concatList
);

console.log(
    "\nMerging rendered clips..."
);

execSync(
    `ffmpeg -f concat -safe 0 -i renders/files.txt -c copy final-night.mp4`,
    {
        stdio: "inherit",
    }
);

console.log("\n");
console.log(
    "================================="
);
console.log(
    "Finished final-night.mp4"
);
console.log(
    "================================="
);