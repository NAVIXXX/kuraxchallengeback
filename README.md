# challengeback

Este proyecto es un backend desarrollado con [NestJS](https://nestjs.com/), un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. Utiliza TypeORM como ORM para la gestión de la base de datos y PostgreSQL como sistema de gestión de base de datos relacional.

## Características principales
- Arquitectura modular basada en controladores, servicios y módulos.
- Autenticación y autorización mediante JWT y Passport.
- Gestión de usuarios y roles.
- Conexión y manejo de base de datos con TypeORM y PostgreSQL.
- Scripts para pruebas unitarias y de integración con Jest.
- Configuración centralizada y manejo de variables de entorno.

## Scripts disponibles
- `start:dev`: Inicia el servidor en modo desarrollo con recarga automática.
- `build`: Compila el proyecto.
- `test`: Ejecuta las pruebas unitarias.
- `test:e2e`: Ejecuta las pruebas end-to-end.
- `seed`: Ejecuta el script de seed para poblar la base de datos.

## Requisitos previos
- Docker
- Docker Compose

## Estructura del proyecto
- `src/`: Código fuente principal.
- `test/`: Pruebas end-to-end.
- `config/`: Configuración de la aplicación y la base de datos.

## Instalación y uso

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.
2. Levanta todos los servicios con Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
   Esto iniciará:
   - **PostgreSQL** en el puerto 5432
     - Base de datos: `posdb`
     - Usuario: `posuser`
     - Contraseña: `pospass`
   - **Aplicación NestJS** en el puerto 3000

3. Para ver los logs de todos los servicios:
   ```bash
   docker-compose logs -f
   ```

4. Para ver los logs de un servicio específico:
   ```bash
   docker-compose logs -f app    # Para la aplicación
   docker-compose logs -f postgres  # Para PostgreSQL
   ```

5. Para reconstruir la aplicación después de cambios en el código:
   ```bash
   docker-compose up -d --build app
   ```

6. Para detener todos los servicios:
   ```bash
   docker-compose down
   ```

7. Para detener y eliminar volúmenes (esto borrará los datos de la base de datos):
   ```bash
   docker-compose down -v
   ```

**Acceso a la aplicación:** Una vez levantados los servicios, la aplicación estará disponible en `http://localhost:3000`

