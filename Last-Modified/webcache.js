import Koa from 'koa';
import path from 'path';

//静态资源中间件
import resource from 'koa-static';
const app = new Koa();
const host = 'localhost';
const port = 7788;

const url = require('url');
const fs = require('fs');
const mime = require('mime');

app.use(async(ctx, next) => {
  // 获取文件名
  const { pathname } = url.parse(ctx.url, true);
  // 获取文件路径
  const filepath = path.join(__dirname, pathname);
  const req = ctx.req;
  const res = ctx.res;
  // 判断文件是否存在
  fs.stat(filepath, (err, stat) => {
    if (err) {
      res.end('not found');
    } else {
      // 获取 if-modified-since 这个请求头
      const ifModifiedSince = req.headers['if-modified-since'];
      // 获取最后修改的时间
      const lastModified = stat.ctime.toGMTString();
      // 判断两者是否相等，如果相等返回304读取浏览器缓存。否则的话，重新发请求
      if (ifModifiedSince === lastModified) {
        res.writeHead(304);
        res.end();
      } else {
        res.setHeader('Content-Type', mime.getType(filepath));
        res.setHeader('Last-Modified', stat.ctime.toGMTString());
        // fs.createReadStream(filepath).pipe(res);
      }
    }
  });
  await next();
});

app.use(resource(path.join(__dirname, './static')));

app.listen(port, () => {
  console.log(`server is listen in ${host}:${port}`);
});