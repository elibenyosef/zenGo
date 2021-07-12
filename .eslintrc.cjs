module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    "spellcheck/spell-checker": [1, {
      "comments": true,
      "strings": true
    }]
 },
  plugins: [
    "spellcheck"
 ],
}
