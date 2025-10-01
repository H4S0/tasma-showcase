// Generated file, do not edit

export type PrismaModels = {
  User: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    posts: any[];
  };
  Post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author: any;
  };
};
