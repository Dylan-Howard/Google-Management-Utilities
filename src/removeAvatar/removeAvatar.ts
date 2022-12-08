/** Removes user profiles from all students in Google Admin Directory */
interface gUser {
  primaryEmail: string,
  orgUnitPath: string,
  name: { fullName: string }
}

function isStudent(user: gUser) : boolean {
  if (user && user.hasOwnProperty('orgUnitPath')) return user.orgUnitPath.includes('/Students/');
  else return false;
}

function isInOrgUnit(user: gUser, orgUnitPath: string) : boolean {
  return user.orgUnitPath.includes(orgUnitPath);
}

function hasAvatar({ primaryEmail } : gUser) : boolean {
  let hasAvatar: boolean = false;
  try {
    const hasAvatar = Boolean(AdminDirectory.Users.Photos.get(primaryEmail));
  } catch (err) {
    Logger.log(`${primaryEmail} likely does not have a user avatar.`);
  }
  return hasAvatar;
}

function removeAvatar({ primaryEmail }: gUser) : void {
  AdminDirectory.Users.Photos.remove(primaryEmail);
}

function main(): void {
  const options = {
    customer: 'my_customer',
    maxResults: 50,
    orderBy: 'EMAIL',
    query: 'email:@stu.warren.kyschools.us',
    pageToken: undefined,
  }
  let pageToken;

  do {
    options.pageToken = pageToken;
    const response = AdminDirectory.Users.list(options);
    const { users } = response;

    users.forEach((user: gUser ) => {
      /** @todo: Ready to run without filtering for tech staff */
      if (isInOrgUnit(user, 'Tech Staff')) {
        Logger.log(`${user.name.fullName}: ${user.orgUnitPath}`);
        if (hasAvatar(user)) removeAvatar(user);
      }
    });

    Logger.log(`Received ${users.length} users`);

    pageToken = response.nextPageToken;
  } while (pageToken);
}
