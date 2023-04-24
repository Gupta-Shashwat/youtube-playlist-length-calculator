const displayPlaylistLength = async () => {
    console.log("Trying to update playlist summary");
    const playlist_id = fetchID();
    console.log(`Fetched playlist ID = ${playlist_id}`);
    const length = await lengthCalculator(playlist_id);
    console.log(`Data of playlist: \n${length}`);
    // const length = await fetch(`https://localhost:5000/${playlist_id}`);
    const summary = createPlaylistSummary(length);
    console.log("Summary generated");
    console.log(summary);
    addSummaryToPage(summary);
    console.log("summary added to the page successfully");
}

// Entry point
if (document.readyState !== "loading") {
    displayPlaylistLength();
} else {
    document.addEventListener("DOMContentLoaded", async () => {
        displayPlaylistLength();
    });
}