NESTJS INTERVIEW
Notas del app.module
Problemas
Separaría configuración usando ConfigModule, eliminaría synchronize en producción en favor de migraciones, haría logging condicional por entorno, y desacoplaría la configuración de TypeORM en un módulo dedicado para mejorar escalabilidad y mantenimiento.

 ❌ synchronize
⚠️ logging
⚠️ process.env directo
⚠️ entities hardcodeadas
❌ falta de config modular


Levantar el entorno productivo 
1. Crear un .env con variables locales comunes y corrientes
2. Postgres:latest -> no determinista 
3. Docker compose up fallo por incompatibilidad con volúmenes 
4. Docker compose down -v elimine el volumes para recrearlo limpiamente. 
5. Modifique el Postgres:latest a una version estable, 15
6. La imagen de la app no se mantenía activa por que no tiene un comando que la mantenga ejecutando , no mantiene un  proceso principal, agregaría un sleep infinitoy o definiría un cmd que ejecute la aplicación command: sh -c "npm install && npm run start:dev"
7. Levanto nuevamente Docker con -d para que quede en segundo plano, verifico que las imágenes se crearon exitosamente
8. Verifico todo con docker compose ps -a

La app quedo corriendo dentro de un contenedor aislado, ahi que entrar a el y prepararlo para poder levantar la app    9. Uso docker compose execrandas app bash
  10. Me muevo al directorio del proyecto y aplico npm Install y npm run start:dev11. Creo un CRUD sencillo usando Thunder client , pruebo el get, post falla por que no tiene validaciones en los dtos antes de la persistencia de datos. 

12. Apago la app, instalo las librerias para usar ValidationPipe() npm install class-validator class-transformer13. Agrego una validación sencilla en en la dto, para enty y string 
13. Agrego un ! Al name!:string para indicar a TS que de hecho si va a llegar un valor en runtime 
14. Automaticamente el error ahora lo manejo con ayuda del validationPipe 

Qué revisar (rápido y con intención)
En el controller
* ❌ ¿maneja errores?
* ❌ ¿retorna null?
* ❌ ¿usa DTOs correctamente?
* ❌ ¿nombres claros en params?

En el service
* ❌ ¿qué pasa si no existe el registro?
* ❌ ¿lanza excepciones o devuelve null?
* ❌ ¿hay lógica mezclada con persistencia?
* ❌ ¿usa correctamente el repository?


Problemas en el controller 

1. ❌ Uso incorrecto de @Param() => nest no convierte automáticamenteticamente a Number, siempre llega como string 
* ❌ Inconsistencia de tipos -> en algunos casos string en otros Number
* ❌ Devuelve null -> mala practica
* ❌ Controller no maneja errores -> delega al service sin control, no hay: NotFoundException , validación de existencia 
* ⚠️ Ruta con / , no es necesario el /
* Conversion manual Number(param.todoListId), hay Pipes para esto


Preguntas típicas 

¿Qué pasa si el id no existe?
Actual:
* devuelve null o falla en service
Correcto:
“Debería lanzar un NotFoundException para devolver un 404.”

¿Qué devolverías aquí?

delete(): Promise<void>

👉 Mejor:
* 204 No Content
o:
* { success: true }

¿Cómo manejarías errores?
“Usaría excepciones HTTP de Nest (NotFoundException, BadRequestException) en el service o controller para tener respuestas consistentes.”

¿Esto escala?
No del todo:
* Tipado inconsistente
* Conversión manual
* Sin validación en params

¿Dónde validarías esto?
“Validaría en DTOs para el body y usaría pipes como ParseIntPipe para params.”


Problemas en el service

❌ get devuelve null -> deberia manejar con not found exception 
❌ update es peligroso -> no valida si existe, puede crear un registro nuevo si no existe, sobreescribe sin control 
❌ delete no valida existencia -> si no existe no pasa nada, igual responde un 204 -> incorrecto 
⚠️ create está bien (pero puedes mencionar mejora) -> el await es innecesario y podria simplemente retornar la creación con la dto sin especificar que campo estoy creando. ⚠️ all() sin problemas (por ahora)
Pero podrías mencionar:
“En escenarios reales agregaría paginación.”


🎯 Respuestas clave de entrevista

👉 ¿Qué pasa si el id no existe?
Antes:
* nada
Ahora:
“Lanzo un NotFoundException para devolver un 404.”

👉 ¿Problema en update?
“Podría crear registros accidentalmente si el id no existe. Lo correcto es validar existencia antes de actualizar.”

👉 ¿Problema en delete?
“No valida si el recurso existe, lo cual rompe la semántica del 204.”

👉 ¿Esto escala?
“Falta paginación y validaciones más robustas, pero la estructura es correcta.”
Detalles extrasmejora en el Update DTO 🎯 Cómo lo explicas
“Uso PartialType para evitar duplicar lógica y permitir updates parciales, manteniendo consistencia con el DTO de creación.”usando npm install @nestjs/mapped-types

🔥 Insight que suma mucho
“Aunque hoy sean iguales, separar DTOs permite evolucionar cada uno sin romper el contrato.”

🚀 Conclusión
* Tener dos DTOs ✔️ correcto
* Tenerlos iguales ❌ pobre diseño
* Usar PartialType ✔️ solución senior


Mejoras en el todo_list.entity.ts❌ Nombre de tabla implícito -> Depende del nombre de la clase → poco controlmejor : @Entity('todo_lists')❌ Columna sin configuración -> Problemas:
* longitud indefinida
* no explícito si es nullable
* no hay constraints


⚠️ Falta de timestamps (muy común)@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
createdAt: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
updatedAt: Date;

⚠️ Índices (si escala)
👉 Si haces búsquedas por nombre:

import { Index } from 'typeorm';

@Index()
@Column(...)
name: string;🎯 Cómo lo explicas
“La entidad es funcional, pero en producción definiría explícitamente el nombre de la tabla, restricciones de columnas y agregaría campos de auditoría como timestamps.”

🔥 Insight que suma mucho
“Las entidades no solo representan datos, también definen reglas de persistencia.”
Mejoras para destacar 
1. Config global usando npm install @nestjs/configpara no usar process.env “Agregué validación de variables de entorno con Joi para asegurar que la aplicación falle en el arranque si la configuración es inválida.”queda una app mucho mas robusta

Agregar paginación:cree un dto para la paginación, luego lo use en el controlleragregue los parámetros page y limit en el controller como parte de la querrá 

