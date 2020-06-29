# animated_pride_flags

<b>Done:</b>
- [Anim 1](./anim1/): Rainbow
  - [\[APNG\]](https://puu.sh/FRqAW/1b35ba0564.apng)
- [Anim 2](./anim2/): Lesbian
  - [\[APNG\]](https://puu.sh/FV8ki/7f58a50a73.apng)
- [Anim 3](./anim3/): Transgender
  - [\[APNG\]](https://puu.sh/G1xY5/a80087c78c.apng)
- [Anim 4](./anim4/): Asexual
  - [\[APNG\]](https://puu.sh/G1wD8/8ba4d86890.apng)
- [Anim 5](./anim5/): Omnisexual
  - \[APNG not yet available\] Of course, you can also render it yourself! Follow the steps below for that.

<b>To be done:</b>
- Anim 6 - Scheduled for 2020-06-30
- Anim 7 - Scheduled for 2020-06-30

<br/>

## Rendering
To render all individual frames:
1. Clone this repo
2. `cd` into the folder of the animation you want to render (`./anim#/render/`)
3. Install all node modules by running `npm i` in that folder.
4. Run the rendering script by running `node .` in that folder.
5. All frames will be available at `./anim#/render/frames_SIZExFRAMERATE/` in the format of `#.png`.

<br/>

To encode all frames into an APNG:
1. If you haven't already, install [FFmpeg](https://ffmpeg.org/) on your computer.
2. `cd` into `./anim#/render/frames_SIZExFRAMERATE/`
3. Run `ffmpeg -framerate FRAMERATE -i %d.png -plays 0 output.apng`
4. Your output file will be at `./anim#/render/frames_SIZExFRAMERATE/output.apng`