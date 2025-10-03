# Copilot Instructions for AI Agents

## Project Overview
This is a Node.js/Express API for user registration, login, user queries, and money transfers. It uses in-memory data storage and is designed for API testing and automation studies.

## Architecture & Key Components
- REST endpoints in `server.js`, `routes.js`, and controllers in `controller/`
- GraphQL API in `graphql/` (run with `npm run start-graphql`)
- Models in `model/` (user, transfer)
- Services in `service/` (business logic)
- Middleware for authentication in `middleware/`
- Tests in `test/` (organized by REST/GraphQL, controller/external/performance)
- Swagger documentation in `swagger.json`

## Developer Workflows
- Start REST API: `node server.js` (default port 3000)
- Start GraphQL API: `npm run start-graphql` (default port 4000)
- Run tests: Use Mocha (see `test/` structure)
- Swagger docs: `http://localhost:3000/api-docs`

## Project-Specific Patterns
- All data is stored in-memory (no external DB)
- JWT authentication for protected endpoints (see `middleware/authenticateToken.js`)
- Transfers above R$ 5.000,00 require favored users
- Login returns a token and user object
- Error handling: 400 for invalid login, 403 for unauthorized, 404 for not found
- User registration checks for duplicates

## Integration Points
- REST: `/users/register`, `/users/login`, `/transfers`
- GraphQL: Mutations and queries for users and transfers
- Token required for transfer endpoints and some GraphQL queries

## Example Patterns
- Login request: `POST /users/login` with `{ "username": "string", "password": "string" }`
- Successful login returns `{ token, user }`
- Invalid login returns 400
- Transfers require JWT in Authorization header

## Key Files
- `server.js`, `routes.js`, `controller/`, `model/`, `service/`, `middleware/`, `test/`, `swagger.json`, `graphql/`

## Conventions
- Use English for code, Portuguese for docs/comments
- Test files mirror controller/service structure
- Use Mocha for tests, Mochawesome for reports

---
For questions about unclear conventions or missing patterns, ask for clarification or examples from maintainers.
