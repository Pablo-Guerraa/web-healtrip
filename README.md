# Healtrip · Web

Panel interno para el equipo de coordinación de turismo médico de Healtrip en Medellín. Usa Next.js 15, React y Tailwind. El inicio presenta los chequeos médicos, las citas con especialistas, las segundas opiniones y las consultas virtuales. [Sitio oficial](https://myhealtrip.co/)

## Uso

1. Aplica las migraciones e inicia `api-healtrip` siguiendo su README.
2. Ejecuta los siguientes comandos desde `web-healtrip`.

```bash
npm ci
node --env-file=.env.example node_modules/next/dist/bin/next dev
```

Abre `http://localhost:3000`. La primera cuenta es administradora; confirma su correo en Mailpit (`http://localhost:8025`) e inicia sesión. Entra directamente al panel. Si ya tenías una cuenta local de la versión anterior, ejecuta la migración de la API e inicia sesión nuevamente.

El login no muestra una acción de confirmación de correo. La primera cuenta conserva la verificación y puede solicitar otro enlace desde la pantalla de registro, tanto al completar el alta como al volver a abrirla. Las cuentas pendientes de versiones anteriores también pueden usar ese reenvío.

Después de crear la primera cuenta, las demás personas ingresan por invitación desde Equipo. Cada persona abre su enlace, crea su contraseña y confirma su correo antes de iniciar sesión.

## Pantallas

| Pantalla      | Función                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Inicio        | Servicios que coordina Healtrip y accesos administrativos según el rol                                               |
| Equipo        | Invitar, asignar roles y activar o desactivar cuentas según los permisos                                              |
| Roles y permisos | Crear y editar roles, seleccionar permisos por módulo y eliminar roles sin asociaciones; requiere `roles:manage` |
| Configuración | Perfil, contraseña y sesiones propias; los datos de empresa y el historial aparecen de forma independiente según los permisos del usuario |

Los roles iniciales son Administrador y Usuario. Son editables: no tienen privilegios implícitos por su nombre. Cualquier rol con «Gestionar roles y permisos» puede administrar los roles desde el panel. El permiso es delegable y permite conceder acceso a todas las funciones implementadas. No existe un superadministrador fijo. Siempre debe quedar al menos un usuario activo con correo confirmado que pueda gestionar roles. No existen organizaciones, membresías, selectores de empresa ni pasos de creación de negocio. Los datos de la empresa se pueden editar después desde Configuración.

## Estructura

- `components/auth/`: sesión y formularios de identidad, registro e invitaciones.
- `components/layout/panel-shell.tsx`: navegación adaptable y protección del panel.
- `components/settings/company-settings.tsx`: configuración única e historial.
- `components/ui/`: botones, entradas, tarjetas, tablas, etiquetas y diálogos reutilizables.
- `lib/api.ts`: cookies y renovación compartida entre solicitudes concurrentes.
- `lib/access.ts`: permisos visuales denegados por defecto.
- `app/panel/` contiene Inicio, Equipo, Roles y permisos, y Configuración.

Los roles y permisos se consultan en `/auth/me`. El inicio obtiene el catálogo de `/settings` cuando la cuenta tiene `settings:read`. Los tokens de los enlaces se leen del fragmento de URL y se retiran de la barra. Si recargas esa pantalla antes de completar la operación, vuelve a abrir el enlace del correo.

Se reutilizan Button, Input, Card, Label, Badge, Table, Dialog y Skeleton. Las páginas mantienen etiquetas accesibles, estados de carga y error, navegación por teclado, menú móvil y desplazamiento horizontal de tablas cuando hace falta.

## Validación

```bash
npm run typecheck
npm test
npm run build
git diff --check
```

La CI verifica esta rama y no despliega. Las pruebas de integración de la API incluyen la migración de cuentas anteriores y el acceso sin organizaciones.

Para verificar la adaptación, inicia sesión y comprueba los cuatro servicios en Inicio y la zona horaria de la operación en Configuración. Revisa también los accesos disponibles con un rol de solo consulta y el menú móvil.

## Configuración y despliegue

`API_URL` es exclusiva del servidor; por defecto apunta a `http://127.0.0.1:4000`. Next la incorpora al compilar el proxy `/api/v1/*` hacia `/v1/*`. Vuelve a compilar si cambia esa dirección. El origen de la web debe coincidir con `WEB_ORIGIN` de la API.

`NEXT_PUBLIC_APP_NAME` define el nombre visible y usa `Healtrip` por defecto. El Dockerfile permite configurar ambas variables al compilar y sirve el resultado standalone en el puerto 3000.

Al actualizar desde la base de dos roles, ejecuta `npm run migration:local` en la API. Se conservan usuarios, contraseñas e invitaciones y se cierran las sesiones una vez. El Administrador inicial recibe `roles:manage` como permiso editable en la base de datos.

## Componentes para pantallas de gestión

Equipo y Roles usan búsqueda, filtros, ordenación y paginación con 10, 25 o 50 resultados por página. En Equipo puedes ordenar desde los encabezados de la tabla o desde los botones sobre las tarjetas en móvil. Las listas muestran estados de carga, error con reintento y ausencia de resultados. Eliminar un rol requiere confirmación. Envía invitaciones desde «Invitar al equipo».

La base reutilizable está en `components/management/`, con los hooks `useManagementList`, `useResource` y `useMutation`. Los formularios comparten bloqueo durante el envío, mensajes de error y acciones de guardar/cancelar. Consulta [la guía y ejemplos](components/management/README.md) antes de añadir un módulo nuevo.

Actualiza API y Web conjuntamente: `GET /users`, `/roles` e `/invitations` devuelven ahora `{items,total,page,pageSize,totalPages}`. Los selectores usan `GET /roles/options` para incluir roles de todas las páginas. Esta mejora no requiere migraciones nuevas ni añade dependencias.

Prueba manual: buscar un usuario, combinar rol y estado, ordenar, cambiar de página y limpiar filtros; filtrar roles por permiso, crear uno, provocar un nombre duplicado y comprobar el error; revisar móvil y un usuario de solo consulta.
