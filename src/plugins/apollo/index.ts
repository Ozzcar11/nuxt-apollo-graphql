import { makeNuxtApolloClient } from "@ozzcar11/utilities/nuxt";
import { ApolloClients, provideApolloClients } from "@vue/apollo-composable";
import {
  type ApolloClient,
  type NormalizedCacheObject,
} from "@apollo/client/core";
import { defineNuxtPlugin } from "nuxt/app";
import destr from "destr";
import { makeUploadClient } from "./upload-client";
import { getApiDomain } from "./utils";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export default defineNuxtPlugin((nuxtApp) => {
  const clients: Record<string, ApolloClient<NormalizedCacheObject>> = {};

  for (const { key, link } of Object.values(APOLLO_CLIENTS)) {
    const cacheKey = `_apollo:${key}`;

    let domain: string = getApiDomain(import.meta.env);
    let headers: Record<string, string> = {};

    if (process.server) {
      domain = import.meta.env.VITE_APP_API_DOMAIN as string;
      headers = { "nuxt-server": "true" };
    }

    clients[key] = makeNuxtApolloClient({
      domain,
      path: link,
      ssrMode: process.server ?? false,
      queryFetchPolicy: "network-only",
      watchQueryFetchPolicy: "network-only",
      headers,
      onError(error) {
        console.log(error);
      },
    });

    nuxtApp.hook("app:rendered", () => {
      nuxtApp.payload.data[cacheKey] = clients[key].cache.extract();
    });

    if (process.client && nuxtApp.payload.data[cacheKey]) {
      clients[key].cache.restore(
        destr(JSON.stringify(nuxtApp.payload.data[cacheKey])),
      );
    }
  }

  clients.upload = makeUploadClient();

  provideApolloClients(clients);
  nuxtApp.vueApp.provide(ApolloClients, clients);
  nuxtApp._apolloClients = clients;

  return {
    provide: {
      apollo: { clients },
    },
  };
});
