import "./ArtistListItem.css";
import { addArtist } from "../../ApiService.js";
import { DropDownList } from "../DropDownList/DropDownList.jsx";

export function ArtistListItem({ artist }) {
   async function handleClick(projectId) {
     await addArtist(artist, projectId);
   }

  return (
    <div className="artistContainer">
      <div className="hover">
        <DropDownList onSelectProject={handleClick} />
      </div>

      <div className="artistTop">
        <div className="profile-details">
          <div className="profile-crop">
            <img src={artist.profileImg} className="profile-Img"></img>
          </div>
          <div className="name-location">
            <h4>{artist.name}</h4>
            <h4>{artist.location}</h4>
          </div>
        </div>
          <div className="rate">
            <p>{artist.rate}</p>
          </div>
        <div>
          <ul className="skills-list">
            {artist.skills.map((skill, i) => {
              return (
                <li key={i}>
                  <p>{skill}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="artistBottom">
        <div className="artist-thumb-crop">
          <img className="artist-thumb-img" src={artist.work[0].images[0]} />
        </div>
      </div>
    </div>
  );
}
