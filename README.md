# BDL Broadcast Overlay System

An automated sports broadcast overlay system built for the Brisbane Dodgeball League using Remotion, React, and TypeScript.

This project synchronises recorded dodgeball footage with referee score-event timelines to generate rendered videos with dynamic scoreboards, team branding, and broadcast graphics.

<img width="1091" height="615" alt="image" src="https://github.com/user-attachments/assets/62d1f490-656a-413b-8e50-fad0267cd3fb" />
<img width="1090" height="612" alt="image" src="https://github.com/user-attachments/assets/3827990b-f4bd-4ec6-a791-77e5b80080be" />


## Features

* Dynamic scoreboard overlays
* Team logo and branding support
* Timeline-synchronised score updates
* Automated rendering using Remotion
* JSON-driven event pipeline
* Multi-hour video support
* DJI split-video support
* Configurable team branding system
* React + TypeScript based architecture

## How It Works

### Referee App

The referee application records timestamped events such as:

* Game start
* Score increases/decreases
* Game finish
* Forfeits

Example raw event:

```json
{
  "eventType": "score_increase",
  "scoringTeam": "red",
  "createdAt": "2026-06-03T17:58:25+10:00"
}
```

### Transformation Layer

The raw event stream is transformed into a render-ready timeline:

```json
{
  "time": 133,
  "redScore": 1,
  "blueScore": 0
}
```

This allows score overlays to synchronise accurately with recorded gameplay footage.

### Remotion Rendering

The transformed timeline data is then consumed by Remotion to render:

* Scoreboards
* Team branding
* Match overlays
* Intro sequences
* Broadcast graphics

## Tech Stack

* React
* TypeScript
* Remotion
* Docker
* PostgreSQL
* Drizzle ORM
* Supabase
* FFmpeg / FFprobe

## Project Structure

```text
src/
├── components/
│   ├── Scoreboard.tsx
│   └── Intro.tsx
│
├── config/
│   └── logoConfig.ts
│
├── data/
│   ├── raw-events.json
│   └── render-timeline.json
│
├── lib/
│   └── transformTimeline.ts
│
└── compositions/
    └── GameVideo.tsx
```

## Example Workflow

1. Record dodgeball competition footage
2. Export referee score-event JSON
3. Import video footage and JSON
4. Transform raw events into render timeline data
5. Render final broadcast video using Remotion
6. Upload rendered video to YouTube

## Future Improvements

* Automated match intro sequences
* Highlight generation
* Sponsor overlays
* Live rendering support
* YouTube chapter generation
* Automatic video metadata extraction
* Cloud rendering pipeline

## Purpose

This project was developed as volunteer software tooling for the Brisbane Dodgeball League to improve media production workflows and automate scoreboard overlays for recorded match footage.


# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
