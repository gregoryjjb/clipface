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

### Authentication

Clipface supports simple password authentication by setting the
`user_password` option in the config file. This will redirect users to a
login screen where the configured password must be entered before the user
can proceed.

For security reasons, the hashed password is stored in a HTTP-only cookie.
Clipface assumes (again for security reasons) that you will be running it
behind a reverse proxy with SSL enabled, so the "secure_cookies" config
option defaults to `true`. This means that the authentication cookie is
created with the "secure" flag, which means it will only be transferred when
the HTTPS protocol is used. If you are running Clipface without SSL, you
should set the "secure_cookies" option to `false` in the config file,
otherwise authentication will not work.

If you see any issues or have any concerns about security, please [open an
issue on Github](https://github.com/Hubro/clipface/issues/new).

## Roadmap

See [Clipface v2.0 tasks](https://github.com/Hubro/clipface/projects/1).
