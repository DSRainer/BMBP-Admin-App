import React from 'react';

const Icon = ({ component: Component, ...props }: { component: any, [key: string]: any }) => {
  return <Component {...props} />;
};

export default Icon;
