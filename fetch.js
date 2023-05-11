// fetches the ID of the youtube playlist
const fetchID = async () => {
    const URL = window.location.href;
    var playlistId = URL.match(/list=([A-Za-z0-9_-]+)/)[1];
    return playlistId;
}

// fetches length of the playlist
const fetchLength = async (playlist_id) => {
    try {
        console.log("Fetching data from youtube api...");
        var length = await fetch(`https://ytplaylist-length-calculator-api.onrender.com/${playlist_id}`);
        console.log("Fetched playlist data successfully.");
        console.log(length);
        return length;
    } catch (e) {
        console.log("Unable to fetch playlist data from API!!!");
        console.error(e);
        return undefined;
    }
}

// main function
async function fetchData() {
    const playlist_id = await fetchID();
    if (playlist_id !== undefined) {
        length = await fetchLength(playlist_id);
    }
    if (length !== undefined) {
        length_json = await length.json();
    }
}

fetchData();
