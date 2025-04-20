This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Image Generation with Stable Horde

This project uses Stable Horde for AI image generation. Follow these steps to set it up:

1. Get a Stable Horde API key:
   - Register at [Stable Horde](https://stablehorde.net/)
   - Generate an API key in your account settings

2. Configure your environment:
   - Create a `.env.local` file in the project root with:
   ```
   STABLE_HORDE_API_KEY=your_api_key_here
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
   ```
   - Note: The Stable Horde API will work with anonymous access if no key is provided, but with lower priority
   - The Pinata API key is required for IPFS storage of generated images

3. Test the integration:
   - Generate an image using the UI to verify everything works
   - Check the console for any API connection errors

For best results with Stable Horde, we recommend using the following parameters:
- Sampler: k_euler_a
- Steps: 20-30
- CFG Scale: 7.0-8.0

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
