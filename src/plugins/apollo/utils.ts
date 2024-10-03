export function getApiDomain(
  env: ImportMetaEnv,
  proxyVariable = "VITE_APP_USE_PROXY",
  apiVariable = "VITE_APP_API_DOMAIN",
) {
  return env[proxyVariable] === "true"
    ? ""
    : env[apiVariable] as string;
}
