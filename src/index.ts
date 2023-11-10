import {
  Logger,
  IPluginMiddleware,
  IBasicAuth,
  IStorageManager,
  PluginOptions,
} from "@verdaccio/types";
import { Router, Request, Response, Application } from "express";
// import axios
import axios from "axios";

import { KoishiAdapterConfig, IPackage } from "../types/index";

export default class VerdaccioMiddlewarePlugin
  implements IPluginMiddleware<KoishiAdapterConfig>
{
  public logger: Logger;
  public verdaccioUrl: string;
  public koishiRegistryUrl: string;
  public scope: string;
  public email: string;
  public constructor(
    config: KoishiAdapterConfig,
    options: PluginOptions<KoishiAdapterConfig>
  ) {
    this.verdaccioUrl = config.verdaccioUrl;
    this.koishiRegistryUrl = config.koishiRegistryUrl;
    this.scope = config.scope;
    this.email = config.email;
    this.logger = options.logger;
  }

  public register_middlewares(
    app: Application,
    auth: IBasicAuth<KoishiAdapterConfig>,
    /* eslint @typescript-eslint/no-unused-vars: off */
    _storage: IStorageManager<KoishiAdapterConfig>
  ): void {
    const transform = (
      name: string,
      version: string,
      description: string,
      date: string
    ): IPackage => {
      return {
        package: {
          name: name,
          scope: this.scope,
          version: version,
          description: description,
          keywords: ["chatbot", "koishi", "plugin"],
          date: date,
          links: {
            npm: `${this.verdaccioUrl}/-/web/detail/${name}`,
            homepage: `https://github.com/${this.scope}/${name.split("/")[1]}`,
            repository: `https://github.com/${this.scope}/${
              name.split("/")[1]
            }`,
            bugs: `https://github.com/${this.scope}/${
              name.split("/")[1]
            }/issues`,
          },
          publisher: {
            username: this.scope,
            email: this.email,
          },
          maintainers: [
            {
              username: this.scope,
              email: this.email,
            },
          ],
          contributors: [
            {
              username: this.scope,
              email: this.email,
            },
          ],
        },
        score: {
          final: 1.0,
        },
        shortname: name.replace(`@${this.scope}/koishi-plugin-`, ""),
        verified: true,
        manifest: {
          description: description,
          locales: ["zh"],
          service: {
            required: [],
            optional: [],
            implements: [],
          },
        },
        rating: 5.0,
        portable: false,
        insecure: false,
        ignored: false,
        category: "manage",
        createdAt: date,
        updatedAt: date,
        installSize: 12934,
        publishSize: 12934,
      };
    };
    // eslint new-cap:off
    const router = Router();
    router.get(
      "/registry",
      async (
        req: Request,
        // eslint-disable-next-line @typescript-eslint/ban-types
        res: Response & { report_error?: Function }
      ): Promise<Response<unknown, Record<string, unknown>> | void> => {
        try {
          const resp_koishi = await axios.get(this.koishiRegistryUrl);
          const resp_private = await axios.get(
            `${this.verdaccioUrl}/-/v1/search?text=@${this.scope}/koishi-plugin`
          );
          const resp_koishi_json = resp_koishi.data;
          for (const pack of resp_private.data.objects) {
            resp_koishi_json.objects.push(
              transform(
                pack.package.name,
                pack.package["dist-tags"].latest,
                pack.package.description,
                pack.package?.time?.modified ?? (new Date()).toJSON()
              )
            );
            resp_koishi_json.total += 1;
          }
          return res.send(resp_koishi_json);
        } catch (err) {
          if (typeof res.report_error === "function") {
            return res.report_error(err);
          }
          this.logger.error(err);
          return res.status(500).end();
        }
      }
    );
    app.use("/-/koishi", router);
  }
}
