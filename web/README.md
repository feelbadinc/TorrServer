# TorrServer web client

### How to start project

`yarn start`

### Eslint
> Prettier will fix the code every time the code is saved

- `yarn lint` - to find all linting problems
- `yarn fix` - to fix code

### How images were generated
`npx pwa-asset-generator public/logo.png public -m public/site.webmanifest -p "calc(50vh - 25%) calc(50vw - 25%)" -b "linear-gradient(135deg, rgb(50,54,55), rgb(84,90,94))" -q 100 -i index.html --path-override ""`
