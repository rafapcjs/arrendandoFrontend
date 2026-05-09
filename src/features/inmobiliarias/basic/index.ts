// Types
export type {
    Inmobiliaria,
    InmobiliariaEstado,
    CreateInmobiliariaDto,
    UpdateInmobiliariaDto,
} from './types/InmobiliariaModel';

// Services
export {
    getInmobiliarias,
    getInmobiliariaById,
    createInmobiliaria,
    updateInmobiliaria,
    toggleEstadoInmobiliaria,
} from './service';

// Queries
export { useInmobiliarias } from './query/inmobiliarias';

export {
    useInmobiliaria,
    useCreateInmobiliaria,
    useUpdateInmobiliaria,
    useToggleEstadoInmobiliaria,
} from './query/inmobiliaria';

// Components
export { InmobiliariaPanel, InmobiliariaManagement } from './components';
