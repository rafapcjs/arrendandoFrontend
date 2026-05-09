// Types
export type {
    Propietario,
    CreatePropietarioDto,
    UpdatePropietarioDto,
    ActivatePropietarioDto,
} from './types/PropietarioModel';

// Services
export {
    getPropietarios,
    getPropietarioById,
    createPropietario,
    updatePropietario,
    activatePropietario,
    deletePropietario,
} from './service';

// Queries
export { usePropietarios } from './query/propietarios';

export {
    usePropietario,
    useCreatePropietario,
    useUpdatePropietario,
    useActivatePropietario,
    useDeletePropietario,
} from './query/propietario';

// Components
export { PropietarioPanel, PropietarioManagement } from './components';
