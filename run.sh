export NODE_TLS_REJECT_UNAUTHORIZED=0
export DEMO_ENDPOINT_EMAIL_RECEIVER="lucas@xihuanwu.com"
export EMP_NODE_MODULES=/Users/lucas/dev/emp/node_modules
export EMP_CLIENT=/Users/lucas/dev/emp/src/tools/client
export EMP_RUNTIME_FOLDER=/Users/lucas/dev/emp_runtime
export EMP_STATIC_FOLDER=/Users/lucas/dev/emp_static
export EMP_ATTACHMENT_FOLDER=/Users/lucas/dev/emp_attachment
export EMP_FRONTEND_URL=https://mtc.localhost
unset http_proxy;
unset https_proxy;
unset ALL_PROXY;
pm2 start raindrop.pm2.json
pm2 logs
