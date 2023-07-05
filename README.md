# verdaccio-koishi

> koishi 插件市场 API 适配

---

## Installation

```bash
npm install --global verdaccio-koishi
```

Modify Verdaccio `config.yaml`, add to `middlewares`:

```yaml
middlewares:
  koishi:
    koishiRegistryUrl: https://registry.koishi.chat
    verdaccioUrl: YOUR_VERDACCIO_URL
    scope: YOUR_SCOPE
    email: YOUR_EMAIL
```

Save and restart Verdaccio, the endpoint is `/-/koishi/registry`.

## Development

See the [verdaccio contributing guide](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.
Once you have completed that, use the following npm tasks.

- `npm run build`

  Build a distributable archive

- `npm run test`

  Run unit test

For more information about any of these commands run `npm run ${task} -- --help`.
