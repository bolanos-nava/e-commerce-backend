import { Router } from 'express';

const testSessionsRouter = Router();

testSessionsRouter.get('/setCookie', (req, res) => {
  // Internally, what the cookie parser is doing is to send a response with the header "Set-Cookie"
  //   res
  //     .setHeader(
  //       'Set-Cookie',
  //       'Cock=Cock;Max-Age=20,Path=/;Expires=Sun, 26 May 2024 01:49:36 GMT',
  //     )
  //     .send();

  res
    .cookie('CookieTest', 'This is a cookie', { maxAge: 60000, signed: true })
    .send('Cookie');
});

testSessionsRouter.get('/getCookie', (req, res) => {
  console.log(req.cookies);
  res.json({
    normal: req.cookies,
    signed: req.signedCookies,
  });
});

testSessionsRouter.get('/session', (req, res) => {
  res.send('Another oneeee');
  console.log(req.sessionStore.sessions);
  console.log('Req headers: ', req.headers);
  console.log('Headers: ', res.getHeaders());
  console.log('Header: ', res.getHeader('Set-Cookie'));
  console.log("there's something here");
});

export default testSessionsRouter;
