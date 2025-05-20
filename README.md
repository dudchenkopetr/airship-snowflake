# Airship Snowflake Connection Manager

A web application for managing Snowflake connections built with Next.js and React.

## Features

- Create and manage Snowflake database connections
- Browse and map tables/views from your Snowflake instances
- Configure field mappings for data integration
- Modern and responsive UI built with Tailwind CSS and ShadcnUI

## Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/airship-snowflake.git
cd airship-snowflake
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is configured for automatic deployment to GitHub Pages using GitHub Actions.

### To deploy:

1. Fork or clone this repository
2. Push changes to the `main` branch
3. GitHub Actions will automatically build and deploy the application to GitHub Pages
4. Access your deployed application at `https://yourusername.github.io/airship-snowflake/`

### Manual deployment:

If you prefer to deploy manually:

```bash
# Build the application
npm run export

# Deploy the 'out' directory to your preferred hosting service
```

## Environment Variables

For GitHub Pages deployment, create a `.env.production` file in the root directory:

```
# Required for GitHub Pages deployment to set the correct base path
NEXT_PUBLIC_BASE_PATH=/airship-snowflake
```

Before deploying, make sure to update the base path to match your repository name.

## License

MIT 