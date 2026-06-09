declare global {
  const process: {
    env: {
      NODE_ENV: string;
      [key: string]: string | undefined;
    };
  };
}

export {};
