# youtube-vtt

Extract and save [WebVTT (.vtt)](https://en.wikipedia.org/wiki/WebVTT) closed caption files from YouTube videos.

YouTube videos don't use a standard closed caption format so this script parses that format and converts it into the WebVTT format. The exported caption files can be used to display native captions in any browser supporting the HTML video element.

## How to use

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
5. For each caption track, a file will be saved called `[Video Title]-[Language Code].vtt`.
