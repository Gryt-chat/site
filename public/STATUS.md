# Declaring an outage

`public/status.json` is served at <https://gryt.chat/status.json>. The desktop and
web clients poll it and show a banner when `active` is true, but only to people
who are signed in.

To announce one, set `active` and write the two strings:

```json
{
  "active": true,
  "title": "Sign-in is temporarily unavailable",
  "body": "You can keep using Gryt until your session expires. We're working on it.",
  "link": "https://discord.gg/Q3JKUGsnHE",
  "linkLabel": "What's going on?"
}
```

Set `active` back to `false` when it's over. Leave the strings or clear them,
either way — nothing reads them while it's false.

## Set it before you take anything down

The site runs on the Pi and rebuilds from source on a ten-minute timer, so a
change here takes up to ten minutes to go live. That is fine for planned
downtime and too slow for a surprise, so set it first and take the machine down
second.

The Pi is deliberately not the machine that runs Keycloak, the identity service
or the Gryt servers. If it were, this file would go down with the thing it is
meant to explain.

## What the banner will not do

It never appears for someone who isn't signed in, and it never appears because
the file failed to load. A client that can't reach `status.json` shows nothing —
inventing an outage from a failed request would fire every time somebody's wifi
dropped.

Keep `title` short enough to read at a glance. `body` is one sentence, and the
useful ones say what still works, not only what doesn't.
