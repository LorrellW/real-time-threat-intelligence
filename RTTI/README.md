# Real‑Time Threat Intelligence Dashboard
![Screenshot 2025-04-30 222337](https://github.com/user-attachments/assets/98ad331b-35b0-4be0-a281-4016acf93f4d)

## Introduction & Project Objectives

-This project aggregates vulnerability scan data from multiple sources and delivers actionable intelligence to security teams. Objectives:

-Centralize asset inventory (Hardware, Software, Data, People, Processes).

-Automate vulnerability scanning and risk scoring.

-Present real‑time dashboards for monitoring and decision‑making.
## Development

Install dependencies:
```shellscript
npm install
```

Run the dev server:

```shellscript
npm run dev
```

Deployment

Build for production:
```shellscript
npm run build
```

Start in production mode:
```shellscript
npm start
```
Deploy the contents of build/server and build/client to your host of choice.



### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

- 📖 [Remix docs](https://remix.run/docs)

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
