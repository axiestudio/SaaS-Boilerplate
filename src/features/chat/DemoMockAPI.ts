// Mock API responses for the demo chat interface
// This simulates realistic Axie Studio API responses for demonstration purposes

export const mockApiResponses = {
  // Greeting and general responses
  greetings: [
    "Hello! Welcome to Axie Studio! 🎉 I'm here to help you discover how our AI-powered chat platform can transform your customer experience. What would you like to know?",
    "Hi there! Thanks for trying our demo! I can tell you about our features, pricing, or help you get started with your own chat interface. What interests you most?",
    "Welcome! I'm excited to show you what Axie Studio can do. Feel free to ask me about custom branding, API integration, or any other features!"
  ],

  // Feature-related responses
  features: {
    branding: "🎨 **Custom Branding** is one of our most popular features!\n\nWith Axie Studio, you get:\n• Complete control over colors, fonts, and styling\n• Logo upload and brand customization\n• Custom welcome messages and placeholder text\n• Real-time preview as you customize\n\nWant to see how easy it is? Try our free trial at https://axiestudio.se/signup",
    
    integration: "🔗 **Axie Studio Integration** is seamless and powerful!\n\nHere's how it works:\n• Simply provide your Axie Studio flow API endpoint\n• Add your API key for secure authentication\n• Test the connection with our built-in tester\n• Deploy instantly - no complex setup required!\n\nYour AI flows will handle all the intelligent responses while we provide the beautiful interface.",
    
    analytics: "📊 **Analytics & Insights** help you understand your customers better!\n\nTrack important metrics like:\n• Total conversations and messages\n• Active sessions and user engagement\n• Response times and satisfaction\n• Popular topics and conversation patterns\n\nAll data is presented in easy-to-understand dashboards that help you optimize your customer experience.",
    
    deployment: "🚀 **Instant Deployment** means you're live in minutes!\n\nEvery chat interface gets:\n• A unique public URL (like /chat/your-brand)\n• Instant activation with one click\n• Mobile-responsive design out of the box\n• Professional appearance that builds trust\n\nNo technical knowledge required - just customize and share!"
  },

  // Pricing responses
  pricing: "💰 **Our pricing is simple and transparent:**\n\n**Free Plan** - Perfect for testing\n• 1 chat interface\n• 1,000 messages/month\n• Basic customization\n\n**Premium Plan** - $29/month\n• Unlimited chat interfaces\n• 50,000 messages/month\n• Advanced branding\n• Priority support\n\n**Enterprise** - Custom pricing\n• White-label solutions\n• Custom domains\n• Dedicated support\n\nStart with our free trial - no credit card required!",

  // Getting started responses
  getting_started: "🚀 **Getting started is super easy!**\n\nHere's the 3-step process:\n\n**1. Sign Up** (30 seconds)\n• Create your free account\n• No credit card required\n\n**2. Configure** (2 minutes)\n• Add your Axie Studio API details\n• Customize your branding\n• Preview in real-time\n\n**3. Deploy** (instant)\n• Get your unique chat URL\n• Share with customers\n• Start engaging!\n\nReady to begin? Visit https://axiestudio.se/signup",

  // Default responses for unmatched queries
  default: [
    "That's a great question! 🤔 I'd love to help you with that. Could you tell me more about what specific aspect of Axie Studio you're interested in? I can discuss features, pricing, integration, or getting started.",
    "I'm here to help! 😊 Feel free to ask me about:\n• Custom branding and design options\n• Axie Studio API integration\n• Pricing and plans\n• Getting started guide\n• Analytics and insights\n\nWhat would you like to explore?",
    "Thanks for your question! 💡 I can provide information about Axie Studio's chat interface builder. Whether you're curious about features, pricing, or implementation - I'm here to help. What specific area interests you most?"
  ]
};

export function generateMockResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Check for greetings
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return mockApiResponses.greetings[Math.floor(Math.random() * mockApiResponses.greetings.length)];
  }
  
  // Check for feature-related keywords
  if (message.includes('brand') || message.includes('custom') || message.includes('color') || message.includes('logo')) {
    return mockApiResponses.features.branding;
  }
  
  if (message.includes('integrat') || message.includes('api') || message.includes('connect') || message.includes('axie')) {
    return mockApiResponses.features.integration;
  }
  
  if (message.includes('analytic') || message.includes('insight') || message.includes('metric') || message.includes('data')) {
    return mockApiResponses.features.analytics;
  }
  
  if (message.includes('deploy') || message.includes('url') || message.includes('share') || message.includes('publish')) {
    return mockApiResponses.features.deployment;
  }
  
  // Check for pricing keywords
  if (message.includes('price') || message.includes('cost') || message.includes('plan') || message.includes('free') || message.includes('premium')) {
    return mockApiResponses.pricing;
  }
  
  // Check for getting started keywords
  if (message.includes('start') || message.includes('begin') || message.includes('setup') || message.includes('how to') || message.includes('tutorial')) {
    return mockApiResponses.getting_started;
  }
  
  // Default response
  return mockApiResponses.default[Math.floor(Math.random() * mockApiResponses.default.length)];
}