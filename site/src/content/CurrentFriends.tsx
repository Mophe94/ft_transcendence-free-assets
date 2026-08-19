import Heading from "../components/heading/Heading";
import ImgFrame from "../components/ImgFrame";
import unit from "../assets/Units/Unit_05.png"
import online from '../assets/buttons/status_buttons/online.png';
import offline from '../assets/buttons/status_buttons/offline.png';
import remove from '../assets/buttons/close.png';
import { useQueryClient } from "@tanstack/react-query";
import { useFriends } from "../hooks/useFriends";
import type { Friend } from "../types/friend";
import { Coalitions } from "../constants/Coalition";
import { Link } from "react-router-dom";
import cardBg from '../assets/background/card/card_bg.png'

export default function CurrentFriends() {
  const queryClient = useQueryClient();

  
  const handleReject = async (requesterId: string) => {
    await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/remove_relation/${requesterId}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('error loading');
      queryClient.invalidateQueries({ queryKey: ['friends', 'currentFriends'] });
      return res.json();
    });
  }

  const { data: currentFriends, isLoading, isError } = useFriends();
  if (isLoading) return <div>Loading...</div>;
  if (isError || !currentFriends) return <div>Error while Loading.</div>;
  return (
    <>
      <Heading
        size='m'
        text={`Current Friends (${currentFriends.users.length})`}
        className="justify-self-start"/>
      <div className="rounded-[10px]
      border border-solid border-[rgb(144,30,30)]
      bg-[#f6f1e3] p-4
      max-h-100 overflow-y-scroll overflow-x-hidden no-scrollbar"> 
      {
        currentFriends.users.length !== 0 ?
        <div
          className='flex flex-col sm:grid sm:grid-cols-2 gap-3 xl:grid-cols-3'
          style={{ '--bg-img': `url(${cardBg})` } as React.CSSProperties}
        >
        {currentFriends.users.map((friend: Friend) => {
          const coalConfig = Coalitions[friend.coalitionId as keyof typeof Coalitions] ?? Coalitions.default;
          return(
            <div key={friend.username} 
              className="grid grid-cols-[30%_auto] relative border-2 rounded-2xl p-2 bg-(image:--bg-img)">
              <div className="">
                <ImgFrame
                  imgSrc={friend.avatarUrl ? friend.avatarUrl:unit }
                  imgAlt={`${friend.username}'picture`}
                  color={coalConfig.colorkey}/>
              </div>
              <div className="font-merienda text-3xl text-center self-center">
                <Link to={`/profile/${friend.username}`}>
                  <div
                    data-text={friend.username}
                    className="
                      relative isolate self-center text-nowrap -m-1
                      before:content-[attr(data-text)]
                      before:absolute before:inset-0 before:-z-10
                      before:[text-stroke:4px_#EEEEEE] before:[-webkit-text-stroke:4px_#EEEEEE]
                      before:text-transparent
                    "
                  >
                    {friend.username}
                  </div>
                </Link>
              </div>
              <img
                src={remove}
                onClick={() => handleReject(friend.id)}
                className="
                  absolute bottom-2 right-2
                  w-7 cursor-pointer"/>
              <img
                src={friend.isOnline ? online:offline}
                
                className="
                  absolute top-2 right-2
                  w-5"/>
            </div>
          );
        })}
        </div>:
        <div>No friends for the moment</div>
      }
      </div> 
    </>
  )
}