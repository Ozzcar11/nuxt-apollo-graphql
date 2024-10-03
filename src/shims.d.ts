/// <reference types="vite-svg-loader" />
declare module "*.vue" {
  import { type DefineComponent } from "vue";
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql'
  const Schema: DocumentNode
  export default Schema
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql'
  const Schema: DocumentNode
  export default Schema
}
