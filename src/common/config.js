let baseURL; //这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
  case "development":
    baseURL = ""; //这里是本地的请求url
    break;
  case "production":
    baseURL = "/"; //生产环境url //http://qs-ma.on-bright.com
    break;
}
export { baseURL };
