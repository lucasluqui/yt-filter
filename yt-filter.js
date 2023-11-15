const LOW_VIEWS_FILTER_MIN_VIEWS = 2000;
const LOW_VIEWS_FILTER_EXECUTION_INTERVAL = 100;
const LOW_VIEWS_FILTER_MAX_RUNS = 50;

var lowViewsFilterRuns = 0;

console.log("[yt-filter] loaded");
filterLowViewsVideos();

function filterLowViewsVideos() {
    const videos = document.getElementsByTagName("ytd-rich-grid-media");
    console.log("[yt-filter] processing filters for: " + videos.length);
    for (var video of videos) {
        const metadata = video.getElementsByTagName("ytd-video-meta-block");
        try {
            const rawViews = metadata[0].innerHTML.split(" views")[0].split("ytd-video-meta-block\">")[6];
            var views = convertViewsStringToInt(rawViews);
            if (views < LOW_VIEWS_FILTER_MIN_VIEWS) {
                video.remove();
            }
        } catch {
            console.log("[yt-filter] error in parsing video views");
        }
    }

    lowViewsFilterRuns += 1;
    if (lowViewsFilterRuns < LOW_VIEWS_FILTER_MAX_RUNS) {
        setTimeout(filterLowViewsVideos, LOW_VIEWS_FILTER_EXECUTION_INTERVAL);
    }
}

function convertViewsStringToInt(rawViews) {
    var total = 0;

    if (rawViews.includes("K")) {
        total = Number(rawViews.split("K")[0]) * 1000;
    } else if (rawViews.includes("M")) {
        total = Number(rawViews.split("M")[0]) * 1000000;
    } else if (rawViews.includes("B")) {
        total = Number(rawViews.split("B")[0]) * 1000000000;
    } else {
        total = Number(rawViews);
    }

    return total;
}