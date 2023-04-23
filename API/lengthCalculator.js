import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const yt_api = process.env.API;
const PORT = process.env.PORT || 5000;

const fetchLength = async (req, res) => {
    try {
        const { ytplaylist_id } = req.params;
        const len = await lengthCalculator(ytplaylist_id);
        console.log(len);
        res.status(200).send(len);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

const lengthCalculator = async (playlist_id) => {
    const URL1 = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items(contentDetails(videoId)),nextPageToken&key=${yt_api}&playlistId=${playlist_id}&pageToken=`;
    const URL2 = `https://www.googleapis.com/youtube/v3/videos?&part=contentDetails&key=${yt_api}&id=`;
    let next_page = '';
    let cnt = 0;
    let totalSeconds = 0;

    async function getVideoDuration(videoId) {
        const response = await axios.get(`${URL2}${videoId}`);
        const duration = response.data.items[0].contentDetails.duration;
        const timeArray = duration.match(/(\d+)(?=[MHS])/g);
        const seconds = parseInt(timeArray.pop() || '0');
        const minutes = parseInt(timeArray.pop() || '0');
        const hours = parseInt(timeArray.pop() || '0');
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        return totalSeconds;
    }

    while (true) {
        const vidList = [];
        const response = await axios.get(URL1 + next_page);
        const results = response.data;

        for (const x of results.items) {
            vidList.push(x.contentDetails.videoId);
        }

        const urlList = vidList.join(',');
        cnt += vidList.length;

        const durations = await Promise.all(urlList.split(',').map(getVideoDuration));
        const totalSeconds = durations.reduce((sum, seconds) => sum + seconds);

        if ('nextPageToken' in results) {
            next_page = results.nextPageToken;
        } else {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const format = `No of videos : ${cnt}
Total length of playlist : ${hours}h ${minutes}m ${seconds}s
At 1.25x : ${Math.floor(totalSeconds / 1.25 / 3600)}h ${Math.floor((totalSeconds / 1.25 % 3600) / 60)}m ${Math.floor(totalSeconds / 1.25 % 60)}s
At 1.50x : ${Math.floor(totalSeconds / 1.5 / 3600)}h ${Math.floor((totalSeconds / 1.5 % 3600) / 60)}m ${Math.floor(totalSeconds / 1.5 % 60)}s
At 1.75x : ${Math.floor(totalSeconds / 1.75 / 3600)}h ${Math.floor((totalSeconds / 1.75 % 3600) / 60)}m ${Math.floor(totalSeconds / 1.75 % 60)}s
At 2.00x : ${Math.floor(totalSeconds / 2 / 3600)}h ${Math.floor((totalSeconds / 2 % 3600) / 60)}m ${Math.floor(totalSeconds / 2 % 60)}s`;
            return format;
        }
    }
}

app.get('/:ytplaylist_id', fetchLength);
app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`))

