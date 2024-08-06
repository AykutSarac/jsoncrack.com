export function generateJsonld() {
  return {
    __html: `{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON Crack",
    "applicationCategory": "DeveloperApplication",
    "logo": "https://jsoncrack.com/assets/192.jpg",
    "screenshot": "https://jsoncrack.com/assets/preview/1.png",
    "description": "JSON Crack is a powerful JSON visualization tool that offers a wide range of features including formatting, validation, conversion, and more.",
    "url": "https://jsoncrack.com",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "operatingSystem": "All",
    "sameAs": [
        "https://www.x.com/jsoncrack",
        "https://www.linkedin.com/company/jsoncrack",
        "https://github.com/AykutSarac/jsoncrack.com"
    ]
    }
    `,
  };
}
