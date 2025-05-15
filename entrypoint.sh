#!/bin/sh

# Make sure value of POSTING_API_PATH is correctly set
if [ -z "$POSTING_API_PATH" ]; then
  POSTING_API_PATH="/posting"
fi

# Make sure value of IDENTITY_API_PATH is correctly set
if [ -z "$IDENTITY_API_PATH" ]; then
  IDENTITY_API_PATH="/auth"
fi

cat > /usr/share/nginx/html/env-config.js <<EOF
window.API_URL='${API_URL}';
window.IDENTITY_API_PATH='${IDENTITY_API_PATH}';
window.POSTING_API_PATH='${POSTING_API_PATH}';
window.DOMAIN2_API_PATH='${DOMAIN2_API_PATH}';
window.KITCHEN_API_PATH='${KITCHEN_API_PATH}';
console.log('Environment loaded from server:', {
  API_URL: window.API_URL,
  IDENTITY_API_PATH: window.IDENTITY_API_PATH, 
  POSTING_API_PATH: window.POSTING_API_PATH,
  DOMAIN2_API_PATH: window.DOMAIN2_API_PATH,
  KITCHEN_API_PATH: window.KITCHEN_API_PATH
});
EOF

exec nginx -g 'daemon off;'