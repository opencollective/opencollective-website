import roles from '../constants/roles';

export function canEditGroup(session, group) {

  if (!session || !session.isAuthenticated) return false;

  const usersByRole = group.usersByRole || {};
  group.members = usersByRole[roles.MEMBER] || [];
  const admin = group.members.find(u => (u.id === session.user.id));
  return (!!admin);
}

export function canEditUser(session, user) {
  if (!session || !session.isAuthenticated) return false;
  return (user.id === session.user.id);
}