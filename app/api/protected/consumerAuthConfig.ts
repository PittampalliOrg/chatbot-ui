export const msalConfig = {
  auth: {
    clientId: "7e15b39d-44e0-4397-877e-4c88fe0f9ab1",
    authority:
      "https://login.microsoftonline.com/0c4da9c5-40ea-4e7d-9c7a-e7308d4f8e38",
    redirectUri: "http://localhost:3000"
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true // Set this to "true" if you are having issues on IE11 or Edge
  }
}

export const loginRequest = {
  scopes: ["User.Read"]
}

export const apiTokenRequest = {
  scopes: ["api://68865588-d66d-4db6-8680-0ad4369fdf5b/access_as_user"]
}
