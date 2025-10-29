import { toast } from 'react-toastify';

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const confirmDialog = ({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmOptions) => {
  const CustomToast = () => (
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        {message && <p className="text-sm text-slate-600 mt-1">{message}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss();
          }}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          {confirmText}
        </button>
        <button
          onClick={() => {
            if (onCancel) onCancel();
            toast.dismiss();
          }}
          className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );

  toast(<CustomToast />, {
    position: 'top-center',
    autoClose: false,
    closeButton: false,
    draggable: false,
    closeOnClick: false,
    style: {
      minWidth: '350px',
    },
  });
};
