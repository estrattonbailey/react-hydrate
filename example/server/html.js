module.exports = (content, state, css) =>
`<html>
  <head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <link rel="icon" href="/favicon.png" type="image/png"></link>

    <meta name="description" content=""/>

    <meta property="og:url" content=""/>
    <meta property="og:site_name" content=""/>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content=""/>
    <meta property="og:description" content=""/>
    <meta property="og:image" content=""/>

    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content=""/>
    <meta name="twitter:url" content=""/>
    <meta name="twitter:title" content=""/>
    <meta name="twitter:description" content=""/>
    <meta name="twitter:image" content=""/>

    <link href="/public/main.css" rel="stylesheet" type="text/css"></link>

    <style id="grid-style">${css}</style>

    <title>@estrattonbailey/frame</title>
  </head>
  <body>
    <div id="root">${content}</div>
    <script>
      window.__state = ${JSON.stringify(state)}
    </script>
    <script src="/public/index.js"></script>
  </body>
</html>
`
