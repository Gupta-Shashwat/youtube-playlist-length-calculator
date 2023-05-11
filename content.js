const displayPlaylistLength = () => {

    let loop = setInterval(() => {
        try {
            const summary = createPlaylistSummary(length_json);
            addSummaryToPage(summary);
            clearInterval(loop);
            clearTimeout(loopLimit);
        } catch (e) {
            console.log("Summary not yet available. Retrying...");
        }
    }, 2000);

    var loopLimit = setTimeout(() => {
        clearInterval(loop);
        console.log("Max no. of retries reached... Unable to fetch playlist data!!!");
    }, 20000);
}

// Entry point
if (document.readyState !== "loading") {
    displayPlaylistLength();
} else {
    document.addEventListener("DOMContentLoaded", async () => {
        displayPlaylistLength();
    });
}