import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

class HttpClient {
    constructor() {
        methods.forEach((method) =>
        this[method] = (url, { headers, params, data } = {}) => new Promise((resolve, reject) => {
            const request = superagent[method](url);

            if (headers) {
                request.set(headers);
            }

            if (params) {
                request.query(params);
            }

            if (data) {
                request.send(data);
            }

            request.end((err, res) => {
                err ? reject(res || err) : resolve(res);
            });
        }));
    }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "HttpClient is not defined" issue.
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
    empty() {}
}

const Http = new HttpClient();
export default Http;
