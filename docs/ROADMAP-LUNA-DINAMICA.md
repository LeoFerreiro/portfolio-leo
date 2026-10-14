# Requisito futuro: fase lunar dinámica del Hero

Estado: pendiente. Este documento no implementa la funcionalidad; la escena actual mantiene la fase fija aprobada.

La Luna del Hero deberá representar la fase lunar astronómica correspondiente a la fecha actual.

## Consideraciones

- Actualizar automáticamente la fase según la fecha y hora, definiendo explícitamente la referencia temporal y la frecuencia necesaria de actualización.
- Mantener una iluminación físicamente coherente con la posición relativa del Sol, la Luna y el observador. La fase no debe simularse mediante una rotación arbitraria de la textura.
- Presentar una orientación visual adecuada para un observador en Argentina. La ubicación de referencia deberá ser configurable si resulta necesaria; no se presupone una ubicación personal ni se requiere geolocalización obligatoria.
- Proporcionar un fallback estático o generado dinámicamente que represente la misma fase, orientación e iluminación. Debe conservar el encuadre editorial y funcionar cuando WebGL no esté disponible o falle.
- Evitar una conexión permanente a una API externa cuando sea viable: evaluar un cálculo astronómico local o datos precalculados con precisión, procedencia y límites documentados.
- Respetar `prefers-reduced-motion`, el rendimiento móvil, la carga diferida y el render bajo demanda. Una actualización de fase no exige animación continua.

## Criterios para una etapa futura

Validar fechas de referencia para Luna nueva, cuartos y Luna llena, además de fases intermedias. Comparar orientación para la ubicación argentina seleccionada y confirmar coherencia entre el 3D y su fallback, incluso sin conexión. Documentar precisión, zona horaria, tratamiento del reloj del dispositivo y pruebas en hardware móvil.

La selección del método de cálculo, ubicación de referencia y estrategia de fallback deberá definirse en una etapa autorizada posterior, manteniendo la composición actual del Hero.
