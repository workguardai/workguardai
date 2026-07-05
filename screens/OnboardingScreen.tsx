'use client';

/**
 * First-run onboarding: create the workspace (org -> project -> site chained
 * through the API), then upload the first drawing. Two steps with a progress
 * indicator; no sidebar until the user has data.
 */
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';
import { DrawingUpload } from '@/components/app/DrawingUpload';
import {
  apiErrorMessage,
  useCreateOrganizationMutation,
  useCreateProjectMutation,
  useCreateSiteMutation,
} from '@/store/api';

export function OnboardingScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [form, setForm] = useState({ org: '', project: '', site: '', location: '' });

  const [createOrg] = useCreateOrganizationMutation();
  const [createProject] = useCreateProjectMutation();
  const [createSite] = useCreateSiteMutation();

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSetup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.org.trim() || !form.project.trim() || !form.site.trim()) {
      toast({ type: 'error', title: 'A few details needed', description: 'Name your organisation, project, and site to continue.' });
      return;
    }
    setBusy(true);
    try {
      const org = await createOrg({ name: form.org }).unwrap();
      const project = await createProject({ organizationId: org.id, name: form.project }).unwrap();
      const site = await createSite({
        projectId: project.id,
        name: form.site,
        location: form.location || undefined,
      }).unwrap();
      setSiteId(site.id);
      setStep(2);
      toast({ type: 'success', title: 'Workspace created', description: 'Now upload your first drawing.' });
    } catch (err) {
      toast({ type: 'error', title: 'Could not create your workspace', description: apiErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col justify-center px-6 py-16">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
        <span className="grid size-7 place-items-center rounded-md bg-accent text-caption font-bold text-accent-ink" aria-hidden>
          W
        </span>
        WorkGuard&nbsp;AI
      </Link>

      <div className="mt-8 flex items-center gap-3">
        <StepDot n={1} state={step > 1 ? 'done' : 'active'} label="Workspace" />
        <span className="h-px flex-1 bg-line" />
        <StepDot n={2} state={step === 2 ? 'active' : 'todo'} label="First drawing" />
      </div>

      {step === 1 ? (
        <form onSubmit={onSetup} className="mt-8 flex flex-col gap-5" noValidate>
          <div>
            <h1 className="text-h2 font-bold text-ink">Set up your workspace</h1>
            <p className="mt-2 text-body text-ink-soft">Your pilot includes one organisation, project, and site.</p>
          </div>
          <Field label="Organisation name" htmlFor="org">
            <input id="org" className={inputClass} value={form.org} onChange={(e) => set('org', e.target.value)} placeholder="ANK Construction" />
          </Field>
          <Field label="Project name" htmlFor="project">
            <input id="project" className={inputClass} value={form.project} onChange={(e) => set('project', e.target.value)} placeholder="Harbour redevelopment" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Site name" htmlFor="site">
              <input id="site" className={inputClass} value={form.site} onChange={(e) => set('site', e.target.value)} placeholder="Harbour Yard" />
            </Field>
            <Field label="Location (optional)" htmlFor="location">
              <input id="location" className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Helsinki" />
            </Field>
          </div>
          <Button type="submit" size="lg" isLoading={busy} className="w-full">
            Continue
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </form>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <h1 className="text-h2 font-bold text-ink">Upload your first drawing</h1>
            <p className="mt-2 text-body text-ink-soft">
              WorkGuard AI will read it and build a live model of your site.
            </p>
          </div>
          {siteId ? <DrawingUpload siteId={siteId} /> : null}
          <Button size="lg" variant="secondary" className="w-full" onClick={() => router.push('/dashboard')}>
            Go to dashboard
          </Button>
        </div>
      )}
    </main>
  );
}

function StepDot({
  n,
  state,
  label,
}: {
  n: number;
  state: 'todo' | 'active' | 'done';
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'grid size-7 place-items-center rounded-full border text-caption font-semibold',
          state === 'done'
            ? 'border-accent bg-accent text-accent-ink'
            : state === 'active'
              ? 'border-accent text-accent'
              : 'border-line text-ink-muted',
        )}
      >
        {state === 'done' ? <Check className="size-4" aria-hidden /> : n}
      </span>
      <span className={cn('text-small font-medium', state === 'todo' ? 'text-ink-muted' : 'text-ink')}>
        {label}
      </span>
    </div>
  );
}
