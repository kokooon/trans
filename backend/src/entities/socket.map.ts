
const userSocketMap: Map<number, string> = new Map();

function addUserSocketPair(userId: number, socketId: string): void {
    userSocketMap.set(userId, socketId);
  }

  function getSocketIdByUserId(userId: number): string | undefined {
    return userSocketMap.get(userId);
  }

  function removeUserSocketPair(userId: number): void {
    userSocketMap.delete(userId);
  }

  function getUserIdBySocketId(socketId: string): number | undefined {
    for (const [userId, sockId] of userSocketMap.entries()) {
      if (sockId === socketId) {
        return userId;
      }
    }
    return undefined;
  }

  export function getCurrentMapState() {
    return Object.fromEntries(userSocketMap);
  }

  export { addUserSocketPair, getSocketIdByUserId, removeUserSocketPair };
  export { getUserIdBySocketId };