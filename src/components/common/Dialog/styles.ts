export const dialogStyles = {
  dialog: `
        w-full max-h-[90vh] overflow-y-auto sm:w-2/3 p-4 relative -z-[51]
        rounded-lg shadow-lg
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=open]:duration-300 data-[state=closed]:duration-300
        data-[state=open]:fade-in data-[state=closed]:fade-out
        data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom
    `,
  dialogContent: 'flex flex-col gap-2 mb-4',
  dialogHeader: 'flex flex-row justify-between items-center pb-2',
  dialogFooter: 'flex flex-row justify-end items-center border-t',
  dialogTitle: 'text-lg font-semibold leading-none tracking-tight',
  closeButton:
    'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
};
