const { app } = require("electron");
const MediaService = require("electron-media-service");
var https = require("https");
var fs = require("fs");

const coverFilePath = app.getPath("temp") + "cover.jpg";
const defaultCoverFilePath = "static/default_cover.png"
let coverExists = false;

let metaData = {
  state: MediaService.STATES.STOPPED,
};

exports.getTrackMetaData = () => {
  return metaData;
};

exports.getCoverFilePath = () => {
  return coverExists ? coverFilePath : defaultCoverFilePath;
};

exports.assignMetadata = (newMetadata) => {
  Object.assign(metaData, newMetadata);
  return typeof metaData.id == "number";
};

exports.trackToMetaData = (track, callback) => {
  if (!track) return {};
  let coverUrl = undefined;
  if (track.album && track.album.cover) {
    coverUrl = "https://" + track.album.cover.replace("%%", "200x200");
  }
  let album = "";
  if (track.album) {
    album = track.album.title;
  }

  const trackData = {
    title: track.title || "",
    artist: track.artists.map((a) => a.title).join(", "),
    album: album,
    albumArt: coverUrl,
    id: hashCode(track.link),
    currentTime: 0,
    duration: track.duration,
    liked: track.liked,
    url: "https://music.yandex.ru" + track.link,
  };

  Object.assign(metaData, trackData);

  if (coverUrl) {
    var file = fs.createWriteStream(coverFilePath);
    https.get(coverUrl, (response) => {
      response.pipe(file);
    });
    file.on('finish', () => {
      coverExists = true;
      callback(metaData);
    });
  } else {
    coverExists = false;
    callback(metaData);
  }
};

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
