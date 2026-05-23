import { HexMediaWindow } from "../components/MediaWindow/HexMediaWindow"
import { useAuth } from "../context/AuthContext";

export default function Test () {
    const { user } = useAuth();
    return (
        <div style={{width: '300px', height:'300px', display: 'inline-block'}}>
            <HexMediaWindow type='img' src={user?.avatarUrl} />
        </div>
    )
}