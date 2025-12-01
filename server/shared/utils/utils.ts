/**
 * Generates a new game key
 * @returns A new game key
 */
export const generateNewGameKey = () => {
  const newGameKey =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return newGameKey;
};
