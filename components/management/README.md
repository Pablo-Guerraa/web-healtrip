# Pantallas de gestión

Componentes comunes que amplían los controles de `components/ui`. Usuarios y Roles son ejemplos reales de uso. Cada módulo conserva sus campos, validaciones y operaciones de negocio.

## Listados

`useManagementList<T>(ruta, {sort, direction?, filters})` mantiene la búsqueda, filtros, orden, página y tamaño de página. Las búsquedas esperan 250 ms y las peticiones anteriores se cancelan para impedir que una respuesta tardía reemplace resultados actuales. Cambiar búsqueda, filtros, orden o tamaño vuelve a la primera página; `reset()` limpia búsqueda y filtros; `reload()` actualiza los resultados conservando el contexto.

La API recibe `page`, `pageSize` (10, 25 o 50), `q`, `sort`, `direction` y los filtros específicos del módulo. Devuelve:

```ts
interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

La página devuelta puede ser inferior a la solicitada cuando se elimina el último registro de una página. Los selectores de roles usan `/roles/options`, que devuelve todos los nombres disponibles y si se pueden asignar; no dependen de la página visible de Roles.

```tsx
const list = useManagementList<Cliente>("/clientes", {
  sort: "name",
  filters: { status: "" },
});
const columns: Column<Cliente>[] = [
  { id: "name", label: "Nombre", sort: "name", render: (row) => row.name },
  { id: "email", label: "Correo", render: (row) => row.email },
];
```

Compón la pantalla con:

- `ManagementHeader`: título, descripción y acción principal.
- `ListToolbar`: búsqueda etiquetada, filtros y limpieza.
- `ListFilter` y `ListSort`: selectores controlados; el módulo decide sus opciones.
- `CollectionContent`: carga, error con reintento, ausencia de datos y búsqueda sin resultados. Oculta los registros anteriores durante cambios de consulta y errores.
- `DataTable<T>`: columnas tipadas, orden accesible con `aria-sort`, acciones por fila y `mobileRender` opcional para tarjetas en móvil con los mismos botones de ordenación sobre ellas.
- `ListPagination`: rango de resultados, tamaño y navegación de páginas. Usa los metadatos devueltos por la API.

Consulta `app/(internal)/panel/users/page.tsx` para la composición completa de una tabla y `app/(internal)/panel/roles/page.tsx` para usar la misma estructura con tarjetas.

## Formularios y acciones

`ManagementForm` reúne envío, cancelación, estado ocupado, bloqueo de campos y errores con foco accesible. Recibe un `onSubmit` asíncrono; el módulo decide el cuerpo y la ruta de su petición. Conserva la validación nativa de los campos (`required`, `type`, `minLength`, etc.). `Field` admite `description` y `error`, asociados al input mediante `aria-describedby` y `aria-invalid`.

`useMutation()` proporciona `pending`, `error`, `reset()` y `run(action)`. `run` impide envíos simultáneos incluso antes del siguiente render, transforma errores de la API y devuelve si la operación terminó correctamente. Después de un éxito el módulo cierra el diálogo, muestra su mensaje y llama a `list.reload()`.

`ConfirmAction` utiliza el mismo formulario para eliminaciones y cancelaciones, con confirmación explícita, estado de procesamiento y error visible. Usuarios conserva sus formularios de invitación y acceso; Roles conserva el editor de permisos.

## API y permisos

Las rutas de cada módulo usan `listSchema`, `pageRows`, `sqlOrder` y `searchPattern` de `src/shared/list.ts` en la API. Los valores se parametrizan, los campos de orden tienen una lista permitida y la búsqueda trata `%`, `_` y `\` como texto literal. Aplica filtros de acceso **antes** de contar y paginar.

Mostrar u ocultar una acción en el cliente mejora la experiencia; cada operación y cada listado deben seguir autorizándose en la API. Los componentes no conceden permisos ni implementan relaciones de acceso del negocio.
