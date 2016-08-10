import superagent from 'superagent';
import { apiHost, apiHeader } from '../clientConfig';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    if (!process.env.BROWSER) {
        // Prepend host and port of the API server to the path.
        return apiHost + adjustedPath;
    }
    // Prepend `/api` to relative URL, to proxy to API server.
    return '/api' + adjustedPath;
}

class ApiClient {
    constructor() {
        methods.forEach((method) =>
        this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
            const request = superagent[method](formatUrl(path));

            apiHeader.forEach((header) => {
                request.set(header.name, header.value);
            });

            if (params) {
                request.query(params);
            }

            if (data) {
                request.send(data);
            }

            request.end((err, res) => {
                err ? reject(res.body || err) : resolve(res.body);
            });
        }));
    }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" issue.
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
    empty() {}
}

const Http = new ApiClient();
export default Http;
