# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

**You can check the app live in [here](https://vitetask.vercel.app/).** If you have some trouble to run it locally.

## Features

we can add, edit, delete by following the input name and description or enable the user in subscriptions section.

### Local Node Enviroment

If you prefer to run the app in your Node local machine

```
npm i
```

```
npm run dev
```

## Technology Highlight

### Tailwind CSS

Although I have the ability to work with `Pure CSS (BEM)`, `CSS Module`, and `CSS in JS`, I decided to use this for rapid development of MVP projects.

### React-hook-form + Zod

Form validation is always needed. We can guide the user to the correct data when they submit it, which reduces the work for the backend servers.

`React-hook-form` is an excellent library to use, but the missing validation schema is not good. By using it with `zod` we can almost validate any complex data schema.

## Code quality

- Ensured the code quality with `eslint`, `style-lint`
- Formated the code with `prettier`
- Commit lint `commit-lint`

Although some developers might trick the process by bypass the commit hook. In the real project, we should protect the important branches (prevent merge directly) and setup CI to check the code quality before merge request.

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
