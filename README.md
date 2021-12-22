# Service health checks

This is a simple REST API i made to check if my services went down.

# Usage

There are 3 endpoints namely ping, start, stop all these endpoints must be followed by a uuid set in the config.json. In case the API doesn't get pinged in the grace time set by you, you will get a alert email set by you in the config.json
