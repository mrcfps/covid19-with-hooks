import React from 'react';

export const renderCustomAxisTick = ({ x, y, payload }) => {
  console.log('payload', payload);
  let path = '';

  return payload.value;
};
