import {
  makeAuthLink,
  makeErrorLink,
  makeMiddlewareLink,
  makeUploadLink,
} from "@ozzcar11/utilities/plugins/apollo/links";
import { makeApolloClient } from "@ozzcar11/utilities/plugins/apollo/client";
import { type ApolloLink } from "@apollo/client";
import { getApiDomain } from "./utils";

export const makeUploadClient = () => {
  const API_DOMAIN = getApiDomain(import.meta.env);

  const authLink = makeAuthLink(API_DOMAIN, {
    "Apollo-Require-Preflight": "true",
  });
  const errorLink = makeErrorLink();
  const middlewareLink = makeMiddlewareLink();
  const uploadLink = makeUploadLink(API_DOMAIN, "graphql/account") as ApolloLink;

  return makeApolloClient({
    domain: API_DOMAIN,
    path: "graphql/account",
    links: [middlewareLink, errorLink, authLink, uploadLink],
    connectToDevTools: import.meta.env.DEV,
  });
};
