/**
 * Object storage abstraction.
 *
 * Responsibility: Decouple the upload pipeline from a concrete storage backend.
 * The default implementation uses Supabase Storage (service-role client). The
 * interface lets us swap to S3/GCS later without touching services.
 *
 * Inputs:  a storage key, bytes and content type.
 * Outputs: the stored key, and (on demand) a time-limited signed URL.
 *
 * Assumptions: requires a live Supabase project + bucket at runtime. With
 * placeholder env this throws `UploadError`, which is the expected POC behavior.
 */
import { UploadError } from '@/lib/errors';
import { env } from '@/lib/env';
import { createAdminSupabase } from '@/lib/auth/supabaseServer';

export interface StoredObject {
  key: string;
}

export interface StorageProvider {
  upload(key: string, bytes: Uint8Array, contentType: string): Promise<StoredObject>;
  download(key: string): Promise<Uint8Array>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}

/** Supabase Storage-backed provider. */
export class SupabaseStorageProvider implements StorageProvider {
  private readonly bucket: string;

  constructor(bucket: string = env.UPLOAD_BUCKET) {
    this.bucket = bucket;
  }

  async upload(key: string, bytes: Uint8Array, contentType: string): Promise<StoredObject> {
    const supabase = createAdminSupabase();
    const { error } = await supabase.storage.from(this.bucket).upload(key, bytes, {
      contentType,
      upsert: false,
    });
    if (error) {
      throw new UploadError('Failed to store uploaded file', { reason: error.message });
    }
    return { key };
  }

  async download(key: string): Promise<Uint8Array> {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase.storage.from(this.bucket).download(key);
    if (error || !data) {
      throw new UploadError('Failed to download stored file', { reason: error?.message });
    }
    return new Uint8Array(await data.arrayBuffer());
  }

  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresInSeconds);
    if (error || !data) {
      throw new UploadError('Failed to create signed URL', { reason: error?.message });
    }
    return data.signedUrl;
  }
}

let singleton: StorageProvider | undefined;

export function getStorage(): StorageProvider {
  if (!singleton) {
    singleton = new SupabaseStorageProvider();
  }
  return singleton;
}
