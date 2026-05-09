// Types
export type {
    Inmobiliaria,
    InmobiliariaDisponible,
    InmobiliariaEstado,
    CreateInmobiliariaDto,
    UpdateInmobiliariaDto,
} from './types/InmobiliariaModel';

// Services
export {
    getInmobiliarias,
    getInmobiliariasDisponibles,
    getInmobiliariaById,
    createInmobiliaria,
    updateInmobiliaria,
    toggleEstadoInmobiliaria,
} from './service';

// Queries
export { useInmobiliarias } from './query/inmobiliarias';
export { useInmobiliariasDisponibles } from './query/inmobiliarias-disponibles';

export {
    useInmobiliaria,
    useCreateInmobiliaria,
    useUpdateInmobiliaria,
    useToggleEstadoInmobiliaria,
} from './query/inmobiliaria';

// Components
export { InmobiliariaPanel, InmobiliariaManagement } from './components';
