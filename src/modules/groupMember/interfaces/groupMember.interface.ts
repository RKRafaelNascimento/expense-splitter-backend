export interface IGroupMember {
  id: number;
  groupId: number;
  memberId: number;
  createdAt: Date;
}

export interface IGroupWithMember {
  id: number;
  groupId: number;
  memberId: number;
  createdAt: Date;
  member: { name: string; email: string };
}
