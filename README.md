# Niyati Application

This is a Next.js application that provides interview tools with features including code execution, audio recording, and image uploads.

## Features

- Authentication using NextAuth.js
- Real-time communication via WebSockets
- Code execution using Judge0 API
- Image uploads with Cloudinary
- Interactive interview interface

## Prerequisites

- Node.js 18.x or later
- pnpm 9.x or later (recommended)
- Backend API server running (for authentication and data)
- WebSocket server running (for real-time communication)

## Environment Variables

Before running the application, you need to set up the following environment variables. Create a `.env.local` file in the root directory with the following:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL for Vercel deployment

# Backend API Configuration
NEXT_PUBLIC_BE_ENDPOINT=http://localhost:8000  # Your backend API endpoint

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:8000  # Your WebSocket server URL

# Judge0 API Configuration (Code Execution)
NEXT_PUBLIC_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
NEXT_PUBLIC_JUDGE0_API_KEY=your_judge0_api_key

# Cloudinary Configuration
# Public variables (accessible in browser)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Server-only variables (not exposed to browser)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/lib` - Utility libraries and services
- `/src/utils` - Helper functions
- `/src/constants` - Application constants
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks

## Deployment on Vercel

### Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI (optional): `npm install -g vercel`

### Deployment Steps

1. Connect your GitHub repository to Vercel:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your repository and follow the setup wizard

2. Configure Environment Variables:

   - In your project settings on Vercel, add all the required environment variables listed above
   - Make sure to set `NEXTAUTH_URL` to your production URL (e.g., https://your-app.vercel.app)

3. Deploy:
   - Vercel will automatically deploy your application when you push changes to your connected repository
   - You can also manually trigger a deployment from the Vercel dashboard

### Important Deployment Notes

- The application uses pnpm as the package manager. Vercel will automatically detect this from the `pnpm-lock.yaml` file.
- Security headers are configured in `vercel.json` to enhance the security of your application.
- Make sure your backend API and WebSocket server are accessible from your Vercel deployment.

## Development Guidelines

- Run `pnpm lint` to check for linting issues
- Run `pnpm format` to format code using Prettier
- Use the Husky pre-commit hooks to ensure code quality

## License

[MIT](LICENSE)
