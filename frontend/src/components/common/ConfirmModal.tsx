import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">{message}</p>
        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase border transition-colors ${
              isDestructive
                ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
                : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
