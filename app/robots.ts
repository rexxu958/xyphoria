export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api"] }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://xyphoria-ii7a6osx9-rexxu958s-projects.vercel.app"}/sitemap.xml`
  };
}
