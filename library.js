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

    const avgLength = createSummaryItem(
        "Average length of videos: ",
        speedUp(length.total_length_in_seconds / length.No_of_videos, 1),
        "#F4F4F4"
    )
    summaryContainer.appendChild(avgLength);

    const totalDuration = createSummaryItem(
        "Total Duration : ",
        speedUp(length.total_length_in_seconds, 1),
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

// returns playlist duration if watched with the given speed
const speedUp = (sec, speed) => {
    const totalSeconds = sec / speed;
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    if (minutes > 9) {
        minutes = `${minutes}`;
    } else {
        minutes = `0${minutes}`;
    }
    let seconds = Math.floor(totalSeconds % 60);
    if (seconds > 9) {
        seconds = `${seconds}`;
    } else {
        seconds = `0${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}
