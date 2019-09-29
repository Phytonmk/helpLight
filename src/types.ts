export interface Organization {
  name: string;
  avatar: string;
  idOrganization: string;
  email: string;
  desc: string;
  title: string;
  city: string;
  tags: string[];
  address: string;
  phone: string;
  participants: Volunteer[];
}

export interface Event {
  type: 'event' | 'task';
  idEvent: string;
  dateFrom: string;
  dateTo: string;
  title: string;
  workDescription: string;
  poster: string;
  peopleRequired: {
    work: string;
    desc: string;
    requirements: string;
    tokens: number;
    amount: number;
    found: number;
  }[];
  tokens: number;
  idOrganization: string;
  applications: Application[];
  location: string | 'home';
  tags: string[];
}

export interface Application {
  idApplication: string;
  volunteerComment: string;
  organizationComment: string;
  approved: boolean;
  rejected: boolean;
  recalled: boolean;
  wasOnEnent: boolean;
  idVolunteer: string;
  idEvent: string;
}
export interface Task {
  id: string;
  idOrganization: string;
  dateFrom: string;
  dateTo: string;
  description: string;
  location: string | 'home';
  tags: string[];
  peopleRequired: {
    work: string;
    desc: string;
    requirements: string;
    tokens: number;
    amount: number;
    found: number;
  }[];
  applies: {
    volunteer: Volunteer;
    status: 'pending' | 'approved' | 'rejected';
    volunteerComment: string;
    organizationComment: string;
  }[];
}

export interface Article {
  idWallRecord: string;
  poster: string;
  textContent: string;
  idOrganization: string;
  likes: number;
}

export interface Comment {
  idComment: string;
  commentText: string;
  authorName: string;
  authorAvatar: string;
  idVolunteer: string;
  idWallRecord: string;
}

export interface Volunteer {
  idVolunteer: string;
  name: string;
  about: string;
  birthday: number;
  avatar: string;
  karma: number;
  tokens: number;
  organizations: Organization[];
  reviews: {
    organization: Organization;
    content: string;
    rate: number;
  }[];
  skills: string[];
  curatedBy: string;
  curates: string[];
  contacts: {
    telegram: string;
    vk: string;
    wp: string;
    fb: string;
    inst: string;
  };
}

export interface Skill {
  idSkill: string;
  description: string;
  idVolunteer: string;
}
