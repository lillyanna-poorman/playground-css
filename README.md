# Playground CSS

Playground CSS is a personal UX/UI practice project: a place to explore design ideas by building them with HTML, CSS, Tailwind CSS, and JavaScript. It focuses on learning how interface details work in the browser and becoming more familiar with frontend code and implementation constraints.

The experiments cover:
- layout and typography
- color systems and theme switching
- responsive design
- scroll-driven animation
- interactive UI studies

The goal is to prototype interactions that are difficult to evaluate in design tools alone, build confidence working directly in code, and better bridge design and development. These are educational experiments, not a component library or finished product.

Tailwind CSS v4 is compiled locally into `tailwind.css` for deployment.

## Build

Install the development dependencies and generate the Tailwind stylesheet:

```sh
npm ci
npm run build:css
```

The generated `tailwind.css` is linked from `index.html`. Include it alongside the other site files when deploying. During development, run `npm run watch:css` to rebuild it as you edit the HTML.

Open the page in a browser to explore the visual effects and experiment with the styling.