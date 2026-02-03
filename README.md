# Restaurant Recommendations Website

A modern restaurant recommendations website built with Next.js 14, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma 7
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (we use Railway)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/simonai-git/restaurant-recommendations.git
cd restaurant-recommendations
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Routes

- `GET /api/health` - Health check endpoint (tests database connection)
- `GET /api/restaurants` - List restaurants (supports `?limit`, `?offset`, `?cuisine`)
- `POST /api/restaurants` - Create a new restaurant

## Database Schema

### Restaurant
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| placeId | String | Google Places ID (unique) |
| name | String | Restaurant name |
| address | String | Full address |
| lat | Float | Latitude |
| lng | Float | Longitude |
| rating | Float? | Average rating |
| priceLevel | Int? | Price level (1-4) |
| cuisineType | String? | Type of cuisine |
| photos | Json | Array of photo URLs |
| phone | String? | Phone number |
| website | String? | Website URL |
| hours | Json? | Operating hours |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

## Railway Configuration

- **Project ID:** cc054446-1ff7-4d0e-b45c-aae9916e9639
- **Environment ID:** a9bcdaa1-33ec-414b-bd5a-44e44dcbf809
- **PostgreSQL Service ID:** 8c7dddbc-8769-436c-878c-cae8b65030a0
- **External Host:** metro.proxy.rlwy.net:45627

## License

MIT
