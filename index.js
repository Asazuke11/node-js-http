'use strict';
//サーバー作成モジュール呼び出し
const http = require('http');
const pug = require('pug');

/*
httpモジュール
公式ドキュメント：https://nodejs.org/docs/v8.9.4/api/http.html
*/
const server = http.createServer((req, res) => {
  const now = new Date();

  //コンソールに時間とリクエスト元IP表示
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);

  //HTTPステータスコードの設定
  res.writeHead(200, {

    //テキスト形式、文字セットの設定
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {

    //GETのリクエスト時
    //heroku https://salty-escarpment-52569.herokuapp.com
    //https://git.heroku.com/salty-escarpment-52569.git
    case 'GET':

      if (req.url === '/') {
        //pugモジュールでのファイル呼び出し
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '焼肉',
          secondItem: 'しゃぶしゃぶ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
      }
      res.end();

      break;

    //POSTのリクエスト時
    case 'POST':
      //クライアントから送られてきたデータを収納する配列作成
      let body = [];
      //次々送られてくるデータを配列にプッシュ
      req.on('data', (chunk) => {
        body.push(chunk);

        //データ送信が終わった時
      }).on('end', () => {
        //配列に入ったデータを全てつなげる
        body = Buffer.concat(body).toString();

        //送られたデータを日本語表示に
        const decoded = decodeURIComponent(body);


        //コンソールに日時とポストされたデータを表示
        console.info('[' + now + '] 投稿: ' + decoded);

        //クライアント側（ブラウザー）に表示
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>　' +
          decoded + '<br>　　　　　　が投稿されました。</h1></body></html>');

        res.end();
      });
      break;

    case 'DELETE':
      res.write('DELETE ' + req.url);
      break;

    default:
      break;
  }



  //サーバーでエラーが発生した時に表示
}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
  //クライアントでエラーがでた時表示
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});


const port = process.env.PORT || 8000; //ポート番号設定

//サーバー起動　起動と同時にコンソールにポート番号表示
server.listen(port, () => {
  console.log('Listening on ' + port);
});
