import RegularBG from "../background/RegularBg"
import AddFriend from "../components/AddFriend"
import Heading from "../components/heading/Heading"
import CurrentFriends from "../content/CurrentFriends"

export default function Social() {
  return (
    <RegularBG>
      <Heading size="l" text="Friends"/>
      <AddFriend/>
      <CurrentFriends/>
    </RegularBG>
  )
}