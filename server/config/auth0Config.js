import { auth } from 'express-oauth2-jwt-bearer'

const jwtCheck = auth({
  audience: "http://localhost:8000", // Matches the audience in the frontend
  issuerBaseURL: "https://dev-33udfmlb57owziaj.us.auth0.com", // Replace with your Auth0 domain
  tokenSigningAlg: "RS256"
});

export default jwtCheck