#!/bin/sh
set -e

# CSP is staged in report-only mode by default so violations are reported
# without breaking the app. Set CSP_REPORT_ONLY=false to enforce the policy.
if [ "${CSP_REPORT_ONLY}" = "false" ]; then
	export CSP_HEADER="Content-Security-Policy"
else
	export CSP_HEADER="Content-Security-Policy-Report-Only"
fi

# Extra space-separated connect-src origins (e.g. the API origin). Empty by default.
export CSP_CONNECT_SRC="${CSP_CONNECT_SRC:-}"

# Optional report-uri to collect violations during the report-only phase.
if [ -n "${CSP_REPORT_URI:-}" ]; then
	export CSP_REPORT="report-uri ${CSP_REPORT_URI};"
else
	export CSP_REPORT=""
fi

envsubst '$PORT $CSP_HEADER $CSP_CONNECT_SRC $CSP_REPORT' \
	< /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

envsubst '$PORT $CSP_HEADER $CSP_CONNECT_SRC $CSP_REPORT' \
	< /etc/nginx/security-headers.conf.template > /etc/nginx/security-headers.conf

exec nginx -g 'daemon off;'
