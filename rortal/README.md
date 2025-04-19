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

## Image Generation with AUTOMATIC1111

This project uses AUTOMATIC1111's Stable Diffusion web UI for image generation. Follow these steps to set it up:

1. Install AUTOMATIC1111's Stable Diffusion Web UI:
   - Follow the instructions at [AUTOMATIC1111 GitHub repository](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
   - Make sure to install with the LCM sampler for fast generation

2. Start the Web UI with API enabled:
   ```bash
   ./webui.sh --api
   # or on Windows
   webui-user.bat --api
   ```

3. Configure your environment:
   - Create a `.env.local` file in the project root with:
   ```
   SD_API_URL=http://127.0.0.1:7860
   ```
   - If your AUTOMATIC1111 is running on a different machine, update the URL accordingly

4. Test the integration:
   - Generate an image using the UI to verify everything works
   - Check the console for any API connection errors

For best performance, we recommend using the LCM sampler with low steps (4-8) and cfg_scale (1.5-3.0).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
