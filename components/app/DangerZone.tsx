'use client';

/** Account deletion with an authentic confirmation (demonstrates useConfirm). */
import { useConfirm } from '@/providers/ConfirmProvider';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';

export function DangerZone() {
  const confirm = useConfirm();
  const { toast } = useToast();

  async function onDelete() {
    const ok = await confirm({
      title: 'Delete your account?',
      description: 'This permanently removes your organisation, sites, and uploaded drawings. This cannot be undone.',
      confirmLabel: 'Delete account',
      cancelLabel: 'Keep account',
      variant: 'danger',
    });
    if (ok) {
      toast({ type: 'success', title: 'Request received', description: 'Account deletion has been scheduled.' });
    }
  }

  return (
    <div className="rounded-2xl border border-danger/30 bg-danger-soft/40 p-6">
      <h2 className="text-h4 font-semibold text-ink">Danger zone</h2>
      <p className="mt-2 max-w-md text-small text-ink-soft">
        Deleting your account removes all sites and data. This action cannot be undone.
      </p>
      <Button variant="danger" size="md" className="mt-4" onClick={onDelete}>
        Delete account
      </Button>
    </div>
  );
}
