export const keys = {
  user: (user: string | null) => ["user", user],
  host: (host: string | null) => ["host", host],
  userFollowing: (userId: string, otherUserId: string) => [
    "following",
    userId + otherUserId,
  ],
};
