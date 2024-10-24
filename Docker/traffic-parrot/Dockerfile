# Usa la imagen oficial de Traffic Parrot
FROM trafficparrot/trafficparrot:latest

# Copiar las configuraciones de requests y responses a la imagen
COPY requests /trafficparrot/requests
COPY responses /trafficparrot/responses

# Exponer el puerto donde Traffic Parrot estará escuchando
EXPOSE 8080

# Comando para iniciar Traffic Parrot
CMD ["start"]
