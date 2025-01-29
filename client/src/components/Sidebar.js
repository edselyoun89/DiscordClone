import React from "react";

function Sidebar({ channels, users, onChannelSwitch }) {
  return (
    <div className="sidebar">
      <h3>КАНАЛЫ</h3>
      <ul>
        {channels.map((channel) => (
          <li key={channel} onClick={() => onChannelSwitch(channel)}>
            # {channel}
          </li>
        ))}
      </ul>
      <h3>ПОЛЬЗОВАТЕЛИ</h3>
      <ul>
        {users.map((user) => (
          <li key={user.socketId}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
