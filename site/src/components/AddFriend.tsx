import { ButtonColor } from "../constants/Colors";
import ColoredButton from "./buttons/ColoredButton";
import Heading from "./heading/Heading";

import { useState } from "react";
import PendingRequests from "../content/PendingRequests";


export default function AddFriend() {
  const [identifier, setIdentifier] = useState<string>('');
  

  const sendRequest = async () => {
    try {
      await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/send_request`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destinatory: identifier}),
      method: 'POST',
      credentials: 'include',
      })
      
    } catch (e) {
      console.log("error: ", e);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value} = e.target;
    setIdentifier(value);
  }

  return (
    <>
      <Heading size="m" text="Add friend" className=""/>
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            autoComplete="none"
            placeholder="Username or email ..."
            onChange={handleChange}
            className="
              w-full
              mb-4 sm:mr-4 sm:mb-0
              border-2 border-amber-800
              bg-white rounded sm:rounded-2xl
              text-[clamp(1rem,5vw,2rem)]
              "/>
          <div className="h-full">
              <ColoredButton color={ButtonColor.Blue} text="Add" func={sendRequest} className="px-5 text-[clamp(1rem,3vw,2rem)]"/>
          </div>
        </form>
      </div>
      <PendingRequests />
    </>
  )
}