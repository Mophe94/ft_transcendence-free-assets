import "./Lobby.css"

export function Lobby () {
    const data = [
        {id: 0, name: "Lobby One", nb_player: 8},
        {id: 1, name: "Lobby Two", nb_player: 8},
        {id: 3, name: "Lobby Three", nb_player: 8},
    ];
    return (
        <div className="lobby-container">
            <table className="lobby-table">
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '70%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Lobby</th>
                    <th>Nb players</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.nb_player}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}