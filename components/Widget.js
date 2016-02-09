import React from 'react';

export default ({
  group,
  transactions,
  users
}) => {

  return (
    <div>
      <img src={group.logo} />
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <h2>Latest transactions</h2>
    </div>
  );
}