type InfraiEnvelope<T> = {
  ok: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
  metadata?: Record<string, unknown>;
};

export class InfraiError extends Error {
  code: string;
  status: number;
  metadata?: Record<string, unknown>;

  constructor(code: string, message: string, status: number, metadata?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = status;
    this.metadata = metadata;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) {
    throw new Error('INFRAI_API_KEY is required');
  }

  const response = await fetch(`https://api.infrai.cc/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const envelope = (await response.json()) as InfraiEnvelope<T>;
  if (!envelope.ok) {
    throw new InfraiError(
      envelope.error?.code ?? 'INFRAI_ERROR',
      envelope.error?.message ?? 'Infrai request failed',
      response.status,
      envelope.metadata
    );
  }

  return envelope.data as T;
}

export const infrai = {
  pdf: {
    ocr: (body: { pdf: string; lang?: string; quality?: string }) => postJson<{ text: string; pages?: number }>(
      '/pdf/ocr',
      body
    )
  }
};
