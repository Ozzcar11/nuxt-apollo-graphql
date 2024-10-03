export const APOLLO_CLIENTS = {
  public: {
    key: "default",
    link: "graphql/public",
  },
  admin: {
    key: "admin",
    link: "graphql/admin",
  },
  account: {
    key: "account",
    link: "graphql/account",
  },
} as const;
