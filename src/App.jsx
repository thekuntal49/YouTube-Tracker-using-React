import React, { useState } from "react";
import { FaPlay, FaRupeeSign } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import { BsFillInfoCircleFill } from "react-icons/bs";

function formatSubscriberCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return count.toString();
  }
}
function formatViewCount(count) {
  return count.toLocaleString();
}

function App() {
  const [channelID, setChannelID] = useState("");
  const [channelData, setChannelData] = useState({
    title: "KUNTAL",
    logo: "https://media.licdn.com/dms/image/D4E03AQFVTayGix2sjw/profile-displayphoto-shrink_400_400/0/1698928533374?e=1720051200&v=beta&t=cxZdCy8gcVFMjq6AJBs6GfcI_B0o4yxWLYxuCSJc030",
    subscriberCount: "48K",
    viewCount: "665,595",
    createdDate: "6 Apr 2019",
    recentVideo: {
      thumbnail: "https://img.youtube.com/vi/7pko2OaaVcM/maxresdefault.jpg",
      videoId: "7pko2OaaVcM",
    },
    popularVideo: {
      thumbnail: "https://img.youtube.com/vi/02Zjz1TY1yc/maxresdefault.jpg",
      videoId: "02Zjz1TY1yc",
    },
  });
  const [incomeRange, setIncomeRange] = useState(`30K - 80K`);
  const updateIncomeRange = (views) => {
    let lowerBound, upperBound;
    const incomePer10KViews = {
      lower: 75,
      upper: 84,
    };

    lowerBound = Math.round(views / 10000) * incomePer10KViews.lower;
    upperBound = Math.round(views / 10000) * incomePer10KViews.upper;

    if (upperBound >= 10000000) {
      upperBound = Math.ceil(upperBound / 10000000) + "Cr";
    } else if (upperBound >= 100000) {
      upperBound = Math.ceil(upperBound / 100000) + "L";
    } else if (upperBound >= 1000) {
      upperBound = Math.ceil(upperBound / 1000) + "K";
    }

    if (lowerBound >= 10000000) {
      lowerBound = Math.floor(lowerBound / 10000000) + "Cr";
    } else if (lowerBound >= 100000) {
      lowerBound = Math.floor(lowerBound / 100000) + "L";
    } else if (lowerBound >= 1000) {
      lowerBound = Math.floor(lowerBound / 1000) + "K";
    }

    setIncomeRange(`${lowerBound} - ${upperBound}`);
  };

  const handleChange = (e) => {
    setChannelID(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiKey = "AIzaSyD4h6FPWFjck7aKtDA4rJvVzHYmp1j7yFw";
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${apiKey}`;

      const channelResponse = await (await fetch(url)).json();
      console.log(channelResponse);

      const viewCount = parseInt(channelResponse.items[0].statistics.viewCount);

      updateIncomeRange(viewCount);

      const recentVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&type=video&order=date&maxResults=1&key=${apiKey}`;
      const recentVideoResponse = await (await fetch(recentVideoUrl)).json();
      console.log(recentVideoResponse);

      const popularVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&type=video&order=viewCount&maxResults=1&key=${apiKey}`;
      const popularVideoResponse = await (await fetch(popularVideoUrl)).json();
      console.log(popularVideoResponse);

      let recentVideoThumbnail, popularVideoThumbnail;

if (recentVideoResponse.items.length > 0) {
  recentVideoThumbnail = recentVideoResponse.items[0].snippet.thumbnails.high.url;
} else {
  recentVideoThumbnail = "https://dl-asset.cyberlink.com/web/prog/learning-center/html/4090/PDR19-YouTube-21_How_to_Name_Your_YouTube_Videos/img/No-Thumbnail.png";
}

if (popularVideoResponse.items.length > 0) {
  popularVideoThumbnail = popularVideoResponse.items[0].snippet.thumbnails.high.url;
} else {
  popularVideoThumbnail = "https://dl-asset.cyberlink.com/web/prog/learning-center/html/4090/PDR19-YouTube-21_How_to_Name_Your_YouTube_Videos/img/No-Thumbnail.png";
}

      setChannelData({
        title: channelResponse.items[0].snippet.title,
        logo: channelResponse.items[0].snippet.thumbnails.high.url,

        subscriberCount: formatSubscriberCount(
          parseInt(channelResponse.items[0].statistics.subscriberCount)
        ),
        viewCount: formatViewCount(viewCount),
        createdDate: new Date(channelResponse.items[0].snippet.publishedAt),
        recentVideo: {
          thumbnail: recentVideoThumbnail,
          videoId: recentVideoResponse.items.length > 0 ? recentVideoResponse.items[0].id.videoId : "",
        },
        popularVideo: {
          thumbnail: popularVideoThumbnail,
          videoId: popularVideoResponse.items.length > 0 ? popularVideoResponse.items[0].id.videoId : "",
        },
        income: incomeRange,
      });
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="text"
          id="input"
          value={channelID}
          onChange={handleChange}
          placeholder="Enter channel ID.."
        />
        <button type="submit" id="btn">
          Search
        </button>
      </form>
      <h2>Preview :</h2>
      <div className="details">
        <img src={channelData.logo} alt="Channel Logo" />
        <h3>{channelData.title}</h3>
        <div className="detail">
          <p>
            <RiUserFollowFill /> <span>{channelData.subscriberCount} </span>
            Subscribers
          </p>
          <p>
            <FaPlay /> <span>{channelData.viewCount}</span> Views
          </p>
          <p>
            <BsFillInfoCircleFill /> Joined{" "}
            <span>
              {new Date(channelData.createdDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
        <div className="videos">
          <div className="recent">
            <p>Recent video</p>
            <a
              href={`https://www.youtube.com/watch?v=${channelData.recentVideo.videoId}`}
              target="_blank"
            >
              <img src={channelData.recentVideo.thumbnail} alt="Recent Video" />
            </a>
          </div>
          <div className="popular">
            <p>Popular video</p>
            <a
              href={`https://www.youtube.com/watch?v=${channelData.popularVideo.videoId}`}
              target="_blank"
            >
              <img
                src={channelData.popularVideo.thumbnail}
                alt="Popular Video"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="income">
        <p>Estimated Income(if Monetized) :</p>
        <p id="rs">
          <FaRupeeSign />
          <span>{incomeRange}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
