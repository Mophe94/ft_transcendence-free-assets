import Heading from "../components/heading/Heading";
import ImgFrame from "../components/ImgFrame";
import unit from "../assets/Units/Unit_05.png"
import online from '../assets/buttons/status_buttons/online.png';
import offline from '../assets/buttons/status_buttons/offline.png';
import remove from '../assets/buttons/close.png';
import { useQueryClient } from "@tanstack/react-query";
import { useFriends } from "../hooks/useFriends";
import type { Friend } from "../types/friend";

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
  // useQuery({
  //   queryKey: ['friends', 'currentFriends'],
  //   queryFn: async () => {
  //     return fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/`, {
  //       method: 'GET',
  //       credentials: 'include',
  //     }).then((res) => {
  //       if (!res.ok) throw new Error('error loading');
  //       return res.json();
  //     });
  //   },
  // });
  if (isLoading) return <div>Loading...</div>;
  if (isError || !currentFriends) return <div>Error while Loading.</div>;
  return (
    <>
      <Heading
        size='m'
        text={`Current Friends (${currentFriends.users.length})`}
        className="sm:text-start"/>
      <div className="flex flex-col gap-3 border p-5 max-h-100 overflow-y-auto no-scrollbar"> 
      {
        currentFriends.users.map((friend: Friend) => {
          return(
            <div key={friend.username} 
              className="grid grid-cols-[30%_auto] relative border rounded-2xl p-2">
              <div className="">
                <ImgFrame imgSrc={friend.avatarUrl ? friend.avatarUrl:unit } imgAlt={`${friend.username}'picture`} color='blue'/>
              </div>
              <div className="font-merienda text-3xl text-center self-center">{friend.username}</div>
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
        })
      }
      </div> 
    </>
  )
}