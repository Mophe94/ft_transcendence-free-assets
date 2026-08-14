import ColoredButton from "../components/buttons/ColoredButton";
import ImgFrame from "../components/ImgFrame";
import { ButtonColor } from "../constants/Colors";
import unit from '../assets/Units/Unit_05.png';
import woodBg from '../assets/background/wood/wood_bg.png';
import Heading from "../components/heading/Heading";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function PendingRequests () {
  const queryClient = useQueryClient();

  const handleReject = async (requesterId: string) => {
    await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/remove_relation/${requesterId}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('error loading');
      queryClient.invalidateQueries({ queryKey: ['friends', 'pendingRequests'] });
      return res.json();
    });
  }
  const handleAccept = async (requesterId: string) => {
    await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/accept/${requesterId}`, {
        method: 'PATCH',
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) throw new Error('error loading');
        queryClient.invalidateQueries({ queryKey: ['friends'] });
        return res.json();
      });
  }

  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ['friends', 'pendingRequests'],
    queryFn: async () => {
      return fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/pending_requests`, {
        method: 'GET',
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) throw new Error('error loading');
        return res.json();
      });
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  else console.log(requests)
  if (isError) return <div>Erreur de chargement.</div>;
  return (
    <>
    <Heading size="m" text={`Pending Requests (${requests.length})`} className="justify-self-start"/>
      
      <div className="
      rounded-[10px]
      border border-solid border-[rgb(144,30,30)]
      bg-[rgb(214,219,187)] p-4
      max-h-100 overflow-y-scroll overflow-x-hidden no-scrollbar">
        { requests.length == 0 ? 
          <div>No pending requests</div>
          :
          <div
            className='flex flex-col sm:grid sm:grid-cols-2 gap-3 xl:grid-cols-3'
            style={{ '--bg-img': `url(${woodBg})` } as React.CSSProperties}>
            {
              requests.map((friend) => {
                console.log(friend);
                return (
                  <div
                    key={friend.username}
                    className="
                    grid grid-cols-2 border-3 rounded-3xl p-3 sm:gap-3 bg-(image:--bg-img) overflow-hidden">
                    <div className='self-center'>
                      <ImgFrame
                        imgSrc={friend.avatarUrl ? friend.avatarUrl: unit}
                        imgAlt={`${friend.username} picture`}/>
                    </div>
                    <div
                      className="
                        font-agba text-center self-center
                        sm:col-start-1 sm:row-start-2 align-middle"
                    >{friend.username}</div>
                    <div className="
                      flex flex-row justify-around
                      sm:flex-col
                      col-span-2 col-start-1
                      sm:col-span-1 sm:row-span-2">
                      <div className="flex h-10 col-start-1 row-start-2 justify-center">
                        <ColoredButton
                          color={ButtonColor.Green}
                          func={() => handleAccept(friend.id)}
                          text="Accept"
                          className="text-xl"/>
                      </div>
                      <div className="flex h-10 col-start-2 row-start-2 justify-center">
                        <ColoredButton
                          color={ButtonColor.Red}
                          func={() => handleReject(friend.id)}
                          text="Reject"
                          className="text-xl"
                        />
                      </div>
                    </div>
                  </div>
                );  
              })
           }
          </div>
        }
      </div>
    </>
  );
}