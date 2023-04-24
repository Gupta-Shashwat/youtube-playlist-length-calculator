// creates the summary container which needs to be added in the description of the playlist
const createPlaylistSummary = (length) => {
    const summaryContainer = document.createElement("div");

    // styling summary container
    summaryContainer.style.display = "flex";
    summaryContainer.style.flexDirection = "column";
    summaryContainer.style.justifyContent = "center";
    summaryContainer.style.alignItems = "start";
    summaryContainer.style.minHeight = "128px";
    summaryContainer.style.margin = "16px 0px";
    summaryContainer.style.padding = "16px";
    summaryContainer.style.borderRadius = "16px";
    summaryContainer.style.background = "rgba(255,255,255,0.2)";
    summaryContainer.style.fontSize = "1.5rem";

    // adding summary items 
    const noOfVideos = createSummaryItem(
        "Number of Videos : ",
        length.No_of_videos,
        "#F1F1F1"
    );
    summaryContainer.appendChild(noOfVideos);

    const totalDuration = createSummaryItem(
        "Total Duration : ",
        `${length.length.hours}:${length.length.minutes}:${length.length.seconds}`,
        "#86EFAC"
    );
    summaryContainer.appendChild(totalDuration);

    const x2 = createSummaryItem(
        "At 2x : ",
        speedUp(length.total_length_in_seconds, 2),
        "#B4FCA5"
    );
    summaryContainer.appendChild(x2);

    const x1_75 = createSummaryItem(
        "At 1.75x : ",
        speedUp(length.total_length_in_seconds, 1.75),
        "#A5FAFC"
    );
    summaryContainer.appendChild(x1_75);

    const x1_5 = createSummaryItem(
        "At 1.5x : ",
        speedUp(length.total_length_in_seconds, 1.5),
        "#FCA5DA"
    );
    summaryContainer.appendChild(x1_5);

    const x1_25 = createSummaryItem(
        "At 1.25x : ",
        speedUp(length.total_length_in_seconds, 1.25),
        "#FCA5A5"
    );
    summaryContainer.appendChild(x1_25);

    return summaryContainer;
}

// creates the key: value pairs and returns them in string format to directly add them in the summary container
const createSummaryItem = (label, value, valueColor = "#facc15") => {
    const container = document.createElement("div");
    container.style.margin = "8px 0px";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.justifyContent = "between";

    const labelContainer = document.createElement("p");
    labelContainer.textContent = label;

    const valueContainer = document.createElement("p");
    valueContainer.style.color = valueColor;
    valueContainer.style.fontWeight = 700;
    valueContainer.style.paddingLeft = "8px";
    valueContainer.textContent = value;

    container.appendChild(labelContainer);
    container.appendChild(valueContainer);

    return container;
};

// adds the creates summary about the playlist length to the description secion of the playlist
const addSummaryToPage = (summary) => {
    let metadataSection = document.querySelector(".immersive-header-content .metadata-action-bar");
    if (!metadataSection) return null;
    const previousSummary = document.querySelector("#ytpdc-playlist-summary-new");
    if (previousSummary) {
        previousSummary.parentNode.removeChild(previousSummary);
    }
    summary.id = "ytpdc-playlist-summary-new";

    metadataSection.parentNode.insertBefore(summary, metadataSection.nextSibling);
}

// fetches the ID of the youtube playlist
const fetchID = () => {
    const URL = window.location.href;
    var playlistId = URL.match(/list=([A-Za-z0-9_-]+)/)[1];
    return playlistId;
}

// returns playlist duration if watched with the given speed
const speedUp = (seconds, speed) => {
    const totalSeconds = seconds / speed;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    return `${hours}:${minutes}:${remainingSeconds}`;
}

// lengthCalculator is the API part which is temporarily added to the extension's code.
// This will be removed once the API for this is hosted on the internet.
// This is the main backend part which calculates the length of the playlist.
const lengthCalculator = async (playlist_id) => {
    const yt_api = "your_api_key_here";
    const URL1 = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items(contentDetails(videoId)),nextPageToken&key=${yt_api}&playlistId=${playlist_id}&pageToken=`;
    const URL2 = `https://www.googleapis.com/youtube/v3/videos?&part=contentDetails&key=${yt_api}&id=`;
    let next_page = '';
    let cnt = 0;
    let totalSeconds = 0;

    async function getVideoDuration(videoId) {
        const response = await fetch(`${URL2}${videoId}`);
        const data = await response.json();
        const duration = data.items[0].contentDetails.duration;
        const timeArray = duration.match(/(\d+)(?=[MHS])/g);
        const seconds = parseInt(timeArray.pop() || '0');
        const minutes = parseInt(timeArray.pop() || '0');
        const hours = parseInt(timeArray.pop() || '0');
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        return totalSeconds;
    }


    while (true) {
        const vidList = [];
        const response = await fetch(URL1 + next_page);
        const results = await response.json();

        for (const x of results.items) {
            vidList.push(x.contentDetails.videoId);
        }

        const urlList = vidList.join(',');
        cnt += vidList.length;

        const durations = await Promise.all(urlList.split(',').map(getVideoDuration));

        totalSeconds += durations.reduce((sum, seconds) => sum + seconds);

        if ('nextPageToken' in results) {
            next_page = results.nextPageToken;
        } else {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const playlistLength = {
                "No_of_videos": cnt,
                "total_length_in_seconds": totalSeconds,
                "length": {
                    "seconds": seconds,
                    "minutes": minutes,
                    "hours": hours
                }
            }
            return playlistLength;
        }
    }
}