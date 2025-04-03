import React from 'react';
import Avatar from 'react-avatar';

function Client({ username }) {
  return (
    <div className="flex items-center mb-3">
      <Avatar name={username.toString()} size={50} round="14px" className="mr-3" />
      <span className="mx-2 text-gray-300 font-medium">{username.toString()}</span>
    </div>
  );
}

export default Client;
