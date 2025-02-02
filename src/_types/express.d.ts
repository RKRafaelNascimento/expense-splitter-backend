declare global {
  namespace Express {
    interface Request {
      groupId?: number;
      memberId?: number;
    }
  }
}
