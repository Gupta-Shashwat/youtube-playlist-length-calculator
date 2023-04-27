const displayPlaylistLength = async () => {
    const playlist_id = fetchID();
    const length = await lengthCalculator(playlist_id);
    // const length = await fetch(`https://localhost:5000/${playlist_id}`);
    const summary = createPlaylistSummary(length);
    addSummaryToPage(summary);
}

// Entry point
if (document.readyState !== "loading") {
    displayPlaylistLength();
} else {
    document.addEventListener("DOMContentLoaded", async () => {
        displayPlaylistLength();
    });
}