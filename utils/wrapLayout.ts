export function wrapLayout(bodies?: string[], headers?: string[]): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Airport Shirts</title>
      <style>
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 0;
        }
      </style>
      ${headers?.join("\n")}
    </head>
    <body>
      ${bodies?.join("\n")}
    </body>
    </html>`;
}