import { HexMediaWindow } from "../components/MediaWindow/HexMediaWindow";
import { useAuth } from "../context/AuthContext";
import "./Profile.css"

export default function Profile() {
    return (
        <div className="content">
            <ProfileBody />
        </div>
  );
}
const stats = {
  "Stats": "",
  "Rank": "#1",
  "Total Damage": "9999",
  "Number of games played": "99",
  "Number of games won": "99",
  "Number of km walked": "9999",
  "Discovered monsters": "123456/123456",
  "Discovered objects": "123456/123456",
  "Achievements": "50/50",
}


export function ProfileBody () {
  const { user } = useAuth();
  return (
    <div className="profile-content-layout">
      <div className="top-left">
        <HexMediaWindow type="img" src={user?.avatarUrl} mediaId="avatar-pic"/>
      </div>
      
      <div className="user-table">
        <ul>
          <li>Username :{user?.username}</li>
          <li>Email: {user?.email}</li>
          <li>Title: MonsterMaster</li>
        </ul>
      </div>
      
      <div className="stats-table">
          {Object.entries(stats).map(([key, value]) => (
            <><div>{key}:</div><div>{value}</div></>
          ))}
      </div>

    </div>
  );
}
