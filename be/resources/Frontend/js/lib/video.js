"use strict";

function checkIsVideo(url) {
    if (!url) return;
    return (
        url.includes("https://www.youtube.com") ||
        url.includes("https://vimeo.com/")
    );
}

function getLinkVideo(link) {
    if (!link) return;
    let video_id = "";
    if (link.includes("https://www.youtube.com")) {
        if (link.includes("?v=")) {
            video_id = link.split("?v=").pop();
            let ampersandPosition = video_id.indexOf("&");
            if (ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
        }
        if (link.includes("embed")) {
            video_id = link.split("/").pop();
        }
        return "https://www.youtube.com/embed/" + video_id;
    } else {
        video_id = link.split("/").pop();
        return "https://player.vimeo.com/video/" + video_id;
    }
}

function getThumbnailVideo(iframe_src) {
    var youtube_video_id = iframe_src
        .match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)
        .pop();

    return `//img.youtube.com/vi/${youtube_video_id}/0.jpg`;
}

export { checkIsVideo, getLinkVideo, getThumbnailVideo };
