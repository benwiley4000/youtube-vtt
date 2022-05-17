var AVOID_CONCURRENT_CAPTIONS = true;

function saveVttFiles(options) {
  var youtubeArgs = ytplayer.config.args;
  var videoName = youtubeArgs.title;
  var playerCaptionsTracklistRenderer = youtubeArgs.raw_player_response.captions.playerCaptionsTracklistRenderer;

  // handle user options
  var translationLanguageCode = options && options.translationLanguageCode;
  if (
    translationLanguageCode &&
    playerCaptionsTracklistRenderer.translationLanguages.findIndex(function(
      language
    ) {
      return language.languageCode === translationLanguageCode;
    }) === -1
  ) {
    console.warn('Valid language codes:');
    console.warn(
      JSON.stringify(
        playerCaptionsTracklistRenderer.translationLanguages,
        null,
        1
      )
    );
    console.warn('ERROR: Invalid translationLanguageCode:', translationLanguageCode);
    console.warn('See above for valid language codes.');
    return;
  }

  var captionTracks = playerCaptionsTracklistRenderer.captionTracks;
  if (!captionTracks.length) {
    console.warn('No captions found for ' + videoName);
    return;
  }
  var tempNode = document.createElement('div');
  captionTracks.forEach(function(captionData) {
    var fetchUrl = captionData.baseUrl;
    if (translationLanguageCode) {
      fetchUrl += '&tlang=' + translationLanguageCode;
    }
    fetch(fetchUrl)
      .then(function(res) {
        return res.text();
      })
      .then(function(xmlString) {
        var xmlParsed = new window.DOMParser().parseFromString(
          xmlString,
          'text/xml'
        );
        var webVttContent = 'WEBVTT ' + videoName + '\n\n';
        webVttContent += 'NOTE generated by https://github.com/benwiley4000/youtube-vtt\n';
        var textElements = xmlParsed.querySelector('transcript').childNodes;
        Array.prototype.forEach.call(textElements, function(text, index) {
          webVttContent += '\n' + (index + 1) + '\n';
          var start = Number(text.getAttribute('start'));
          var end = start + Number(text.getAttribute('dur'));
          if (AVOID_CONCURRENT_CAPTIONS && index + 1 < textElements.length) {
            // youtube captions overlap so this gets rid of that
            var nextStart = Number(
              textElements[index + 1].getAttribute('start')
            );
            end = Math.min(end, nextStart);
          }
          webVttContent += formatTime(start) + ' --> ' + formatTime(end) + '\n';
          // remove font tags from caption content
          var content = text.textContent.replace(/<[^>]+>/g, '');
          tempNode.innerHTML = content;
          webVttContent += tempNode.textContent + '\n';
        });
        var languageCodeSuffix = '-' + captionData.languageCode;
        if (translationLanguageCode) {
          languageCodeSuffix += '-to-' + translationLanguageCode;
        }
        download(
          videoName + languageCodeSuffix + '.vtt',
          webVttContent
        );
      });
  });

  function pad2(number) {
    // thanks https://www.electrictoolbox.com/pad-number-two-digits-javascript/
    return (number < 10 ? '0' : '') + number;
  }

  function pad3(number) {
    return number >= 100 ? number : '0' + pad2(number);
  }

  // thanks https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function formatTime(time) {
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var milliseconds = 0;
    while (time >= 60 * 60) {
      hours++;
      time -= 60 * 60;
    }
    while (time >= 60) {
      minutes++;
      time -= 60;
    }
    while (time >= 1) {
      seconds++;
      time -= 1;
    }
    milliseconds = (time * 1000).toFixed(0);
    return (
      pad2(hours) +
      ':' +
      pad2(minutes) +
      ':' +
      pad2(seconds) +
      '.' +
      pad3(milliseconds)
    );
  }
}
