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
}

export interface Event {
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
  idOrganization: number;
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
  id: string;
  name: string;
  about: string;
  birthday: number;
  avatar: string;
  karma: number;
  tokens: number;
  reviews: {
    organization: Organization;
    content: string;
    rate: number;
  }[];
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
