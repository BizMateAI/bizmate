BizMate static site (single-file)
Files:
- index.html : main page (single-file)
- /assets/logo.svg : placeholder logo
- /assets/og-image.png : placeholder OG image (SVG content)

To deploy:
1. Create a GitHub repo and upload these files under the repo root (index.html + assets/).
2. In repo Settings -> Pages, choose 'main' branch and / (root) as publish source OR upload to gh-pages branch.
3. Add CNAME file with your domain 'bizmte.com' if using custom domain and configure DNS as instructed in the deployment guide.

Replace placeholders:
- Update Formspree ID in the form action or swap to your backend/email provider.
- Replace /assets/logo.svg and /assets/og-image.png with final assets.
