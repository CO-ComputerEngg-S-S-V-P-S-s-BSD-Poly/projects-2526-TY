# Gallery Backend

## Setup

1. `cd backend`
2. `npm install`
3. `npm run dev`

Server starts on `http://localhost:5000`.

## API

- `GET /health`
- `GET /api/decorations`
- `GET /api/decorations/:id`
- `POST /api/decorations`
- `PUT /api/decorations/:id`
- `DELETE /api/decorations/:id`

Optional query filters for list endpoint:
- `category` (`wedding`, `festival`, `religious`, `party`, `corporate`, `family`)
- `budget` (`low`, `medium`, `high`)
