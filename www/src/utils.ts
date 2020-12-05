export const timeFormatter = (seconds: number) => {
  const [from, length] = seconds >= 3600 ? [11, 8] : [14, 5];
  return (value: number) =>
    new Date(value * 1000).toISOString().substr(from, length);
};
