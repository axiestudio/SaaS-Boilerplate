# Axie Studio - Chat Interface Builder

The official chat interface builder for Axie Studio. Create and customize branded chat experiences that connect seamlessly to your Axie Studio flows.

## Features

- **🎨 Custom Branding**: Full control over colors, logos, and messaging
- **🔗 API Integration**: Seamless connection to Axie Studio flows
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Real-time Chat**: Instant messaging with your customers
- **🌐 Unique URLs**: Each chat interface gets its own public URL
- **📊 Analytics**: Monitor conversations and performance
- **🔒 Secure**: Enterprise-grade security and privacy

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Requirements

- Node.js 20+
- PostgreSQL database
- Clerk account for authentication
- Axie Studio API access

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
DATABASE_URL=your_database_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## About Axie Studio

Axie Studio is a powerful platform for building AI-powered conversational flows. This chat interface builder allows you to create custom-branded chat experiences that connect to your Axie Studio flows, providing a seamless customer experience.

Visit [axiestudio.se](https://axiestudio.se) to learn more about Axie Studio.

## License

MIT License