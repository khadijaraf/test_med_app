// Configuration file for API endpoints
const API_URL = window.location.hostname === "localhost" 
  ? "https://khadijasyed4-8181.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai" 
  : "https://khadijasyed4-8181.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";

console.log(
    "API_URL :",
    API_URL
);

// Alternative configuration for different environments
const config = {
  development: {
    API_URL: "https://khadijasyed4-8181.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
  },
  production: {
    API_URL: "https://khadijasyed4-8181.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
  }
};

export { API_URL };
export default config;