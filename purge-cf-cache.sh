#!/bin/bash
# Purge Cloudflare cache for undangyah.id
# Accessible by www-data (called from PHP after landing rebuild)

CF_ZONE_ID="292d2382c4a0f172d6c8f87f945bdcc9"
CF_API_TOKEN="${CF_API_TOKEN}"

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything":true}' > /dev/null 2>&1
