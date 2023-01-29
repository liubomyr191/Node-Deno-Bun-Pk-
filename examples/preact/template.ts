export default (tags: Record<string, string>) => `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/DALL-Echu.webp">
    
    ${tags && tags.title}
    <meta name="description" content="The Featherweight Deno SSR Library">

    ${tags && tags.modulepreload}

    <style>
      html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        font-family: helvetica, sans-serif;
        line-height: 1.5rem;
        display: flex;
        flex-direction: column;
      }

      img { max-width: 100%; object-fit: contain; }
      li { margin: 10px 0; }
      a { color: royalblue; }
      a:visited { color: hotpink; }
      h1 { font-size: 3rem; color: #fad803; margin: 1rem; }
      h2 { font-weight: normal; }

      main { flex: 1; }
      .row { display: flex; align-items: center; }
      .justify-around { justify-content: space-around; }

      .container {   
        max-width: 800px;
        margin: 0 auto;
      }

      .align-center {
        display: flex; 
        flex-direction: column;
        align-items: center;
      }

      .btn-lg-primary {
        border: solid 1px limegreen;
        background-color: turquoise;
        padding: 0.5rem;
        font-size: 1rem;
      }

      .btn-lg-secondary {
        border: solid 1px red;
        background-color: orange;
        padding: 0.5rem;
        font-size: 1rem;
      }

      footer {
        background-color: saddlebrown;
        color: white;
        padding-top: 20px;
      }
    </style>
  </head>
  <body>
    <div id="root">
      ${tags.appHTML}
    </div>

    ${tags && tags.hydrationScript}
  </body>
  </html>`