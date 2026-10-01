# AI tutor worker

The small server sidecar for Thread Academy's AI tutor. The site stays fully
static — this worker only turns retrieved lesson passages into a
natural-language answer. The LLM API key lives here, never in the browser.

## Deploy

```bash
cd tutor-worker
npx wrangler login
npx wrangler secret put LLM_API_KEY   # paste your key when asked
npx wrangler deploy
```

Any OpenAI-compatible API works — change `LLM_BASE_URL` / `LLM_MODEL` in
`wrangler.toml` (OpenAI, Meta, DeepSeek, …).

## Connect the site

Rebuild the site with the worker's URL:

```bash
NEXT_PUBLIC_TUTOR_API_URL=https://thread-academy-tutor.<you>.workers.dev/ask npm run build
```

The tutor widget then answers in full sentences. Without this variable it
shows the matching lesson passages directly (retrieval mode).

## Regenerating the lesson index

When lessons change, rebuild `public/tutor-index.json`:

```bash
python3 scripts/build-tutor-index.py
```

(Needs a Python venv with `onnxruntime`, `transformers`, `tokenizers`,
`numpy`, `huggingface_hub`.)
