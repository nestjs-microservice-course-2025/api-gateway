# Cliente API Gateway

El gateway es el punto de comunicación entre los microservicios. Es el encargado de enrutar las peticiones entrantes a los microservicios correspondientes y de manejar las respuestas de los mismos.

## Dev

1. Clonar el repositorio
2. Instalar las dependencias
3. Crear un archivo `.env` con las credenciales de la base de datos basado en el `env.template`
4. Levantar el servidor de NATS

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

5. Tener levantados los microservicios que se van a usar
6. Levantar el proyecto con `npm run start:dev`
