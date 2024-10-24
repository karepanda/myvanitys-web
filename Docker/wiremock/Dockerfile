# Use the official WireMock image as the base
FROM wiremock/wiremock:latest

# Copy the stubs directory from the local machine to the WireMock stubs directory in the container
# This allows WireMock to serve the stubbed responses defined in the files
COPY ./stubs /home/wiremock/wiremock/stubs
COPY ./mappings /home/wiremock/mappings
COPY ./__files /home/wiremock/__files

# Expose the default WireMock port
# This allows you to access the WireMock server from outside the container
EXPOSE 8080
