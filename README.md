# App Queue Website

Marketing/sales landing page for App Queue.

## Deployment

This site automatically deploys to GitHub Pages when you push to the `main` branch.

### Setup

1. Create a new GitHub repository (e.g., `app-queue-site` or `appqueue.dev`)

2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**
   - The workflow will run automatically

4. (Optional) Add custom domain:
   - In Settings → Pages, add your custom domain
   - Create a `CNAME` file with your domain name

### Custom Domain Setup

If using a custom domain like `appqueue.dev`:

1. Add a `CNAME` file to the root with your domain:
   ```
   appqueue.dev
   ```

2. Configure DNS:
   - For apex domain: Add `A` records pointing to GitHub's IPs
   - For subdomain: Add `CNAME` record pointing to `username.github.io`

## Updating Content

- **Images**: Replace files in the `images/` folder
- **Text**: Edit `index.html`
- **Gumroad Link**: Search for `gumroad.com/l/app-queue` and replace with your actual product URL

## File Structure

```
app-queue-site/
├── index.html              # Main landing page
├── images/
│   ├── dashboard.png       # Hero screenshot
│   ├── installation.png    # Installation complete
│   ├── running.png         # App running
│   └── closeup.png         # Card closeup
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
└── README.md
```
