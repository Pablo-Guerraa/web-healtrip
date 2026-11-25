# Business Core · Web

Panel elemental para una sola empresa. Esta base se copia para iniciar proyectos independientes, cada uno con su propia API y base de datos. Conserva Next.js 15, React, Tailwind y los componentes visuales reutilizables de Appointix.

## Uso

1. Inicia `Appointix-api`, rama `feat/business-core`, siguiendo su README.
2. En esta carpeta, con la misma rama:

```bash
npm ci
node --env-file=.env.example node_modules/next/dist/bin/next dev
```

Abre `http://localhost:3000`. La primera cuenta es administradora; confirma su correo en Mailpit (`http://localhost:8025`) e inicia sesión. Entra directamente al panel. Si ya tenías una cuenta local de la versión anterior, ejecuta la migración de la API e inicia sesión nuevamente.

El login no muestra una acción de confirmación de correo. La primera cuenta conserva la verificación y puede solicitar otro enlace desde la pantalla de registro, tanto al completar el alta como al volver a abrirla. Las cuentas pendientes de versiones anteriores también pueden usar ese reenvío.

Después de crear la primera cuenta, los demás usuarios ingresan por invitación. El administrador envía el enlace desde Usuarios; el invitado abre ese enlace, crea su contraseña y ya puede iniciar sesión. Una invitación válida confirma el correo sin enviar una segunda confirmación.

## Pantallas

| Pantalla      | Función                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Inicio        | Acciones básicas disponibles según el rol                                                                            |
| Usuarios      | Invitar, asignar roles dinámicos y activar/desactivar usuarios según permisos                                             |
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
- `app/panel/`: Inicio, Usuarios, Roles y permisos, y Configuración.

Los roles y permisos se consultan en `/auth/me`; las operaciones se autorizan además en la API. No se guardan credenciales ni selecciones de organización en localStorage. Los tokens de los enlaces se leen del fragmento de URL y se retiran de la barra. Si recargas esa pantalla antes de completar la operación, vuelve a abrir el enlace del correo.

Se reutilizan Button, Input, Card, Label, Badge, Table, Dialog y Skeleton. Las páginas mantienen etiquetas accesibles, estados de carga y error, navegación por teclado, menú móvil y desplazamiento horizontal de tablas cuando hace falta.

## Validación

```bash
npm run typecheck
npm test
npm run build
git diff --check
```

La CI verifica esta rama y no despliega. Las pruebas de integración de la API incluyen la migración de cuentas anteriores y el acceso sin organizaciones.

Revisión manual: crear un rol, marcar sus permisos, asignarlo al invitar o editar un usuario y comprobar los accesos. Delegar «Gestionar roles y permisos» a un rol personalizado y verificar que puede crear roles. Verificar la protección del último gestor activo. También registrar y confirmar la primera cuenta, entrar directamente, invitar a otra persona, crear su cuenta y entrar sin otro correo de confirmación; comprobar sus permisos; cambiar rol y verificar que deba iniciar sesión nuevamente, desactivar acceso, editar perfil y configuración. Revisar el panel en móvil y con teclado.

## Configuración y despliegue

`API_URL` es exclusiva del servidor; por defecto apunta a `http://127.0.0.1:4000`. Next la incorpora al compilar el proxy `/api/v1/*` hacia `/v1/*`. Vuelve a compilar si cambia esa dirección. El origen de la web debe coincidir con `WEB_ORIGIN` de la API.

`NEXT_PUBLIC_APP_NAME` solo contiene el nombre público del producto. Los secretos no deben usar prefijos públicos. El Dockerfile permite configurar ambas variables al compilar y sirve el resultado standalone en el puerto 3000. No hay dominios ni credenciales de despliegue de Appointix.

Al actualizar desde la base de dos roles, ejecuta `npm run migration:local` en la API. Se conservan usuarios, contraseñas e invitaciones y se cierran las sesiones una vez. El Administrador inicial recibe `roles:manage` como permiso editable en la base de datos.

## Componentes para pantallas de gestión

Usuarios y Roles usan búsqueda, filtros, ordenación y paginación en la API, con 10, 25 o 50 resultados por página. Usuarios ordena desde los encabezados de la tabla; en móvil los mismos botones aparecen sobre las tarjetas. Las listas muestran estados de carga, error con reintento y ausencia de resultados; las búsquedas y filtros se pueden limpiar. Eliminar un rol requiere confirmación. Las invitaciones se envían desde el botón «Invitar usuario» de Usuarios; la pantalla contiene un único listado de cuentas y no muestra una sección de seguimiento de invitaciones.

La base reutilizable está en `components/management/`, con los hooks `useManagementList`, `useResource` y `useMutation`. Los formularios comparten bloqueo durante el envío, mensajes de error y acciones de guardar/cancelar. Consulta [la guía y ejemplos](components/management/README.md) antes de añadir un módulo nuevo.

Actualiza API y Web conjuntamente: `GET /users`, `/roles` e `/invitations` devuelven ahora `{items,total,page,pageSize,totalPages}`. Los selectores usan `GET /roles/options` para incluir roles de todas las páginas. Esta mejora no requiere migraciones nuevas ni añade dependencias.

Prueba manual: buscar un usuario, combinar rol y estado, ordenar, cambiar de página y limpiar filtros; filtrar roles por permiso, crear uno, provocar un nombre duplicado y comprobar el error; revisar móvil y un usuario de solo consulta.
