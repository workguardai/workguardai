'use client';

/**
 * Upload a drawing to a site, then run the AI evaluation on it. Accepts any file
 * (POC parser). Shows upload/evaluate progress and the current drawings list.
 */
import { useRef, useState, type DragEvent } from 'react';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/app/DataStates';
import {
  apiErrorMessage,
  useGetDrawingsQuery,
  useUploadDrawingMutation,
  useEvaluateDrawingMutation,
} from '@/store/api';

export function DrawingUpload({ siteId }: { siteId: string }) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  const drawings = useGetDrawingsQuery(siteId);
  const [upload, uploadState] = useUploadDrawingMutation();
  const [evaluate] = useEvaluateDrawingMutation();

  async function handleFile(file: File) {
    try {
      await upload({ siteId, file }).unwrap();
      toast({ type: 'success', title: 'Drawing uploaded', description: `${file.name} is ready to evaluate.` });
    } catch (e) {
      toast({ type: 'error', title: 'Upload failed', description: apiErrorMessage(e, 'Please try a different file.') });
    }
  }

  async function handleEvaluate(id: string) {
    setEvaluatingId(id);
    try {
      const res = await evaluate(id).unwrap();
      toast({
        type: 'success',
        title: 'Evaluation complete',
        description: `${res.milestonesCreated} milestones and ${res.alertsCreated} alerts generated.`,
      });
    } catch (e) {
      toast({ type: 'error', title: 'Evaluation failed', description: apiErrorMessage(e) });
    } finally {
      setEvaluatingId(null);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-accent bg-accent-soft/50' : 'border-line-strong bg-raised hover:bg-sunken/60',
        )}
      >
        {uploadState.isLoading ? (
          <Loader2 className="size-6 animate-spin text-accent" aria-hidden />
        ) : (
          <Upload className="size-6 text-accent" aria-hidden />
        )}
        <span className="text-body font-medium text-ink">
          {uploadState.isLoading ? 'Uploading...' : 'Drop a drawing, or click to upload'}
        </span>
        <span className="text-caption text-ink-muted">DWG or any plan file</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {drawings.isLoading ? (
        <Skeleton className="h-14 w-full rounded-xl" />
      ) : (drawings.data?.length ?? 0) > 0 ? (
        <ul className="flex flex-col divide-y divide-line rounded-xl border border-line bg-raised">
          {drawings.data!.map((d) => (
            <li key={d.id} className="flex items-center gap-3 p-4">
              <FileText className="size-5 shrink-0 text-ink-muted" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-medium text-ink">{d.originalName}</p>
                <p className="text-caption text-ink-muted">{d.status.toLowerCase()}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                isLoading={evaluatingId === d.id}
                iconLeft={<Sparkles className="size-4" aria-hidden />}
                onClick={() => handleEvaluate(d.id)}
              >
                Evaluate
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
