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
  const drawerRef = useRef<HTMLDialogElement>(null);
  const { heading, showDialog, onClose, children, footer } = props;
  const { dialog, dialogContent, dialogHeader, dialogTitle, dialogFooter, closeButton } =
    dialogStyles;

  useEffect(() => {
    if (showDialog && drawerRef.current) {
      drawerRef.current.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!showDialog && drawerRef.current) {
      drawerRef.current.close();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDialog]);

  return (
    <Conditional if={showDialog}>
      <dialog ref={drawerRef} className={dialog} data-state={showDialog ? 'open' : 'closed'}>
        <div className={dialogContent} id="dialog-content">
          <div className={dialogHeader}>
            <h2 className={dialogTitle}>{heading}</h2>
            <Button variant="outline" onClick={onClose} className={closeButton}>
              <X />
            </Button>
          </div>
          <div className={dialogStyles.dialogContent}>{children}</div>
          {footer && <div className={dialogFooter}>{footer}</div>}
        </div>
      </dialog>
    </Conditional>
  );
};
