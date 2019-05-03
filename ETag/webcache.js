
import path from 'path';
import Koa from 'koa';

//静态资源中间件
import resource from 'koa-static';
const app = new Koa();
const host = 'localhost';
const port = 7878;

const url = require('url');
const fs = require('fs');
const mime = require('mime');
/*
const crypto = require('crypto');
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
      console.log(111);
      // 获取 if-none-match 这个请求头
      const ifNoneMatch = req.headers['if-none-match'];
      const readStream = fs.createReadStream(filepath);
      const md5 = crypto.createHash('md5');
      // 通过流的方式读取文件并且通过md5进行加密
      readStream.on('data', (d) => {
        console.log(333);
        console.log(d);
        md5.update(d);
      });
      readStream.on('end', () => {
        const eTag = md5.digest('hex');
        // 验证Etag 是否相同
        if (ifNoneMatch === eTag) {
          res.writeHead(304);
          res.end();
        } else {
          res.setHeader('Content-Type', mime.getType(filepath));
          // 第一次服务器返回的时候，会把文件的内容算出来一个标识，发给客户端
          fs.readFile(filepath, (err, content) => {
            // 客户端看到etag之后，也会把此标识保存在客户端，下次再访问服务器的时候，发给服务器
            res.setHeader('Etag', etag);
            // fs.createReadStream(filepath).pipe(res);
          });
        }
      });
    }
  });
  await next();
});
*/
// 我们这边直接使用 现成的插件来简单的演示下。如果要比较的话，可以看上面的代码原理即可
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
app.use(conditional());
app.use(etag());

app.use(resource(path.join(__dirname, './static')));

app.listen(port, () => {
  console.log(`server is listen in ${host}:${port}`);
});