# Axie Studio Chat Interface Builder

A complementary application for Axie Studio clients to create and customize chat interfaces that connect to Axie Studio flows.

## Features

- **API Integration**: Connect your chat interface to Axie Studio flows
- **Custom Branding**: Customize your chat interface appearance
- **Unique Chat URLs**: Each user gets a dedicated chat interface URL
- **Real-time Chat**: Interactive chat interface for your customers

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Requirements

- Node.js 20+
- PostgreSQL database
- Clerk account for authentication

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
DATABASE_URL=your_database_url
```

## License

MIT License