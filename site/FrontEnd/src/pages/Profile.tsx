import { useParams } from "react-router-dom";
import { HexMediaWindow } from "../components/MediaWindow/HexMediaWindow";
import { useAuth, type User } from "../context/AuthContext";
import "./Profile.css"
import React, { useEffect, useState } from "react";

export default function Profile() {
  let { username } = useParams< {username?: string}>();

  if (!username){
    const { user } = useAuth();
    if (!user) {
      return null;
    }
    username = user?.username
  }

    return (
        <div className="content">
            <ProfileBody username={username} />
        </div>
  );
}


interface ProfileBodyProps {
  username: string;
}

export function ProfileBody({ username }: ProfileBodyProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/${username}`, {
      method:'Get',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {setUser(data.user);})
    .catch(() => {return null;})
  }, [username])

  console.log(user);
  if (!user || !user.stats)
    return null;

  const stats = {
  "Stats": "",
  "Number of games played": user.stats.nb_fights,
  "Number of games won": user.stats.nb_victories,
  "Number of games lost": user.stats.nb_defeats,
  "Total Damage": user.stats.total_damage_given,
  "Number of km walked": user.stats.distance_walked,
  "Discovered monsters": `${user.stats.nb_monsters_discovered} / ??`,
  "Discovered objects": `${user.stats.nb_objects_discovered} / ??`,
  "Achievements": `${user.stats.nb_achievements} / ??`,
}
  return (
    <div className="profile-content-layout">
      <div className="top-left">
        <HexMediaWindow type="img" src={user?.avatarUrl} mediaId="avatar-pic"/>
      </div>
      
      <div className="user-table">
        <ul>
          <li>Username :{user.username}</li>
          <li>Email: {user?.email}</li>
          <li>Title: MonsterMaster</li>
        </ul>
      </div>
      
      <div className="stats-table">
          {Object.entries(stats).map(([key, value]) => (
            <React.Fragment key={key}><div>{key}:</div><div>{value}</div></React.Fragment>
          ))}
      </div>

    </div>
  );
}
