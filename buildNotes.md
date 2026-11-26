## Build

Install the development dependencies and generate the Tailwind stylesheet:

```sh
npm ci
npm run build:css
```

The generated `tailwind.css` is linked from `index.html`. Include it alongside the other site files when deploying. During development, run `npm run watch:css` to rebuild it as you edit the HTML.

Open the page in a browser to explore the visual effects and experiment with the styling.