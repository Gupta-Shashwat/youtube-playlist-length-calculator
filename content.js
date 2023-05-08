const displayPlaylistLength = async () => {
    const playlist_id = fetchID();
    const length = await fetch(`https://ytplaylist-length-calculator-api.onrender.com/${playlist_id}`);
    const length_json = await length.json();
    const summary = createPlaylistSummary(length_json);
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