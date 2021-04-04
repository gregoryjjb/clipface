# Clippy Mc. Clipface

Simple, self hosted clip sharing application.

## Usage with Docker

First of all pull the Docker image:

```
$ docker pull tomsan/clipface
```

Very simple usage, no authentication, port 80:

```
docker run -d \
  --name clipface \
  -v /host/path/to/clips:/clips \
  -p 80:80 \
  tomsan/clipface:latest
```

For more advanced usage, you need to add a config file. Create the file
"clipface.toml" on your host machine and add the content from
[clipface.toml.example][1].

[1]: https://raw.githubusercontent.com/Hubro/clipface/master/client/clipface.example.toml

Map the config file to `/config/clipface.toml` inside the Docker container,
for example:

```
docker run -d \
  --name clipface \
  -v /host/path/to/clips:/clips \
  -v /host/path/to/clipface.toml:/config/clipface.toml \
  -p 80:80 \
  tomsan/clipface:latest
```

## NGINX reverse proxy with SSL

Clipface is intended to be used behind a SSL enabled reverse proxy (though
that's not required.)

Here is an example NGINX configuration that uses certificates from Let's
Encrypt:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name my-clipface-domain.com;

    ssl_certificate /etc/letsencrypt/live/my-clipface-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-clipface-domain.com/privkey.pem;

    # SSL config below generated by: ssl-config.mozilla.org

    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;  # about 40000 sessions
    ssl_session_tickets off;

    ssl_dhparam dhparam.pem;

    # Intermediate configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (ngx_http_headers_module is required) (63072000 seconds)
    add_header Strict-Transport-Security "max-age=63072000" always;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # Replace with the IP address of your resolver
    resolver 1.1.1.1 1.1.2.2;

    location / {
        proxy_pass http://clipface/;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 3s;
        proxy_send_timeout 10s;
        proxy_read_timeout 300s;
        client_max_body_size 100m;
    }
}
```

You must replace the URL in `proxy_pass http://clipface/` with your local
Clipface address, for example `http://127.0.0.1:3000`. In my case I'm
running both Clipface and NGINX as Docker containers in the same Docker
network, so I'm simply referring to Clipface by its container name,
"clipface".

**NB:** The "X-Forwarded-*" headers are required for the server to know its
*own URL, which is needed for certain server-side rendered meta tags. If you
*don't configure these headers, things like embedding Discord videos will
*fail.

**NB:** This config assumes you have the file "dhparam.pem" in your NGINX
*root config directory. If you don't, you can generate it like this: `openssl
dhparam -out /my/nginx/config/path/dhparam.pem 2048`.

**NB:** The `Strict-Transport-Security` header informs browsers to always use
HTTPS towards your domain. This will break any HTTP (not HTTPS) applications
you are hosting on your domain, so enable with care.

## Authentication

Clipface supports simple password authentication by setting the
`user_password` option in the config file. This will redirect users to a
login screen where the configured password must be entered before the user
can proceed.

For security reasons, the hashed password is stored in a HTTP-only cookie.
Clipface assumes (again for security reasons) that you will be running it
behind a reverse proxy with SSL enabled, so the "secure_cookies" config
option defaults to `true`. This means that the authentication cookie is
created with the "secure" flag, which means it will only be transferred when
the HTTPS protocol is used. If you are running Clipface without SSL (not
using HTTPS), you should set the "secure_cookies" option to `false` in the
config file, otherwise authentication will not work. Be aware that passwords
will be transferred in plain text in this case.

If you see any issues or have any concerns about security, please [open an
issue on Github](https://github.com/Hubro/clipface/issues/new).

## Single clip tokens

Clipface will automatically generate single clip authentication tokens when
the "Copy public link" button is pressed. These tokens only allow access to
a single clip.

They are generated by hashing the clip name with the configured user
password (plus some salt). This means that all single clip auth tokens can
be invalidated by changing the user password. Single clip auth tokens for a
specific clip can be invalidated by renaming the clip.

## Roadmap

See [Clipface v2.0 tasks](https://github.com/Hubro/clipface/projects/1).
