interface User {
  _id: string;
  provider: string;
  providerUserId: string;
  email: string;
  name: string;
  profilePicture: string;
  signUpAt: Date;
  lastLoginAt: Date;
}

interface Device {
  family: string;
  major: string;
  minor: string;
  patch: string;
}

interface Os {
  family: string;
  major: string;
  minor: string;
  patch: string;
}

interface UserAgent {
  family: string;
  major: string;
  minor: string;
  patch: string;
  device: Device;
  os: Os;
}

interface Session {
  userId: string;
  token: string;
  creationDtm: Date;
  userAgent: UserAgent;
  accessGroupKeys: any[];
}

export interface AltogicAuth {
  user: User;
  session: Session;
}
