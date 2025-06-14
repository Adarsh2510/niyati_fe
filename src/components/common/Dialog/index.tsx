import { useRef, useEffect } from 'react';
import { dialogStyles } from './styles';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Conditional from '@/components/Conditional';

type TDialogProps = {
  heading: string;
  showDialog: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export const Dialog = (props: TDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { heading, showDialog, onClose, children, footer } = props;
  const {
    dialog,
    dialogContent,
    dialogHeader,
    dialogTitle,
    dialogFooter,
    closeButton,
    dialogOverlay,
  } = dialogStyles;

  useEffect(() => {
    if (showDialog && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!showDialog && dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDialog]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      onClose();
    }
  };

  return (
    <Conditional if={showDialog}>
      <>
        <div className={dialogOverlay} />
        <dialog
          ref={dialogRef}
          className={dialog}
          data-state={showDialog ? 'open' : 'closed'}
          onClick={handleBackdropClick}
        >
          <div className={dialogContent} id="dialog-content">
            <div className={dialogHeader}>
              <h2 className={dialogTitle}>{heading}</h2>
              <Button variant="outline" onClick={onClose} className={closeButton}>
                <X />
              </Button>
            </div>
            <div className="py-4">{children}</div>
            {footer && <div className={dialogFooter}>{footer}</div>}
          </div>
        </dialog>
      </>
    </Conditional>
  );
};
