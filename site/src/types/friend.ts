export default interface Friends {
  users: Friend[]
}

export interface Friend {
  username: string,
  id: string,
  coalitionId: number,
  avatarUrl: string | undefined, 
  isOnline: boolean,
}