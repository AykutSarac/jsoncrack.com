module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
}
