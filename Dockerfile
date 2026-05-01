# Use the official lightweight Nginx image
FROM nginx:alpine

# Copy the static website files to the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run requires the container to listen on the port specified by the PORT environment variable.
# We will use envsubst to replace the PORT variable in the Nginx config at runtime.
CMD /bin/sh -c "envsubst '\\$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
