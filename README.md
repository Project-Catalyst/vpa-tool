# vpa-tool

This is the repo for the vPA tool frontend.

The process involves importing a CSV file with all assessments that are saved in the localStorage and reviewed locally by the Veteran Community Advisor.
An external endpoint is connected to the app to have the updated number of reviews carried out by the vPAs and to be able to coordinate the work efficiently.

The development is based on Vue.js

An example CSV to import is [here](https://gist.github.com/coire1/86ac2bca2c0799ee5d5001f8a343f2c3)
The demo is [here](https://cardanocataly.st/vpa-tool/)

## Development

### Project Setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
