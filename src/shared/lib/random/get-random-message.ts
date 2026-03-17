export const getRandomMessage = (messages: string[]) =>
  messages[Math.floor(Math.random() * messages.length)];
