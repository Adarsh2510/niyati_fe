export const dialogStyles = {
  dialog: `
        fixed inset-0 z-50 m-auto
        w-[95%] max-w-lg max-h-[90vh] overflow-y-auto sm:w-2/3 p-4 
        rounded-lg shadow-lg bg-white dark:bg-gray-800
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=open]:duration-300 data-[state=closed]:duration-300
        data-[state=open]:fade-in data-[state=closed]:fade-out
        data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
    `,
  dialogContent: 'flex flex-col gap-2 mb-4',
  dialogHeader: 'flex flex-row justify-between items-center pb-2',
  dialogFooter: 'flex flex-row justify-end items-center border-t',
  dialogTitle: 'text-lg font-semibold leading-none tracking-tight',
  closeButton:
    'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
  dialogOverlay: 'fixed inset-0 bg-black/50 z-40',
};
