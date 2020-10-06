# youtube-vtt

Extract and save [WebVTT (.vtt)](https://en.wikipedia.org/wiki/WebVTT) closed caption files from YouTube videos.

YouTube videos don't use a standard closed caption format so this script parses that format and converts it into the WebVTT format. The exported caption files can be used to display native captions in any browser supporting the HTML video element.

## How to use

### Simple usage (visiting page in browser)

1. Open a YouTube video with closed captions in a web browser
2. Open the JavaScript console (in Chrome this is Ctrl+Shift+J/Cmd+Shift+J/).
3. Paste the contents of `save-vtt-files.js` and hit Enter.
4. Run the command to export and save a .vtt file for each caption track:

    a. To export with default settings, just run:
    ```js
    saveVttFiles();
    ```
    b. By default we're making only one caption display at a time, but YouTube saves the captions in overlapping (two-at-a-time) fashion, which makes sense for the way YouTube shows captions. If you'd like to preserve the overlapping durations, you can run this instead:
    ```js
    AVOID_CONCURRENT_CAPTIONS = false;
    saveVttFiles();
    ```
    c. If you'd like your captions to be auto-translated into a different language by YouTube, you can specify the language code as an option:
    ```js
    saveVttFiles({ translationLanguageCode: 'zh-Hans' });
    ```
5. For each caption track, a file will be saved called `[Video Title]-[Language Code].vtt`.

### Command line usage

Alternatively, you can use a CLI which allows you to trigger downloads in a more automated fashion.

#### Installation

```console
npm install -g youtube-vtt
```

You also must have the Google Chrome browser (not Chromium) installed on your system or the commands below will fail.

#### Examples

Download captions for a video (vtt files go into a `downloads` directory under the current working path):

```console
youtube-vtt https://www.youtube.com/watch?v=XXXXXXXXXXX
```

Translate downloaded captions to Simplified Chinese:

```console
youtube-vtt https://www.youtube.com/watch?v=XXXXXXXXXXX --translation zh-Hans
```

Allow concurrent timespans for captions (disabled by default):

```console
youtube-vtt https://www.youtube.com/watch?v=XXXXXXXXXXX --concurrent
```

Wait only one second for downloads to complete (default wait time is 5 seconds):

```console
youtube-vtt https://www.youtube.com/watch?v=XXXXXXXXXXX --wait 1000
```

Wait 15 seconds for downloads to complete (if you have a slow connection):

```console
youtube-vtt https://www.youtube.com/watch?v=XXXXXXXXXXX --wait 15000
```

Run in debug mode. The browser will open a window rather than running in the background, and it will wait for you to close it manually, allowing you to interact with the browser and inspect the page.

```console
youtube-vtt https://www.youtube.com/watch?v=XXXXXXXXXXX --debug
```
