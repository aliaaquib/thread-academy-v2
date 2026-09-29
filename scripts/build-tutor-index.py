#!/usr/bin/env python3
"""
Build-time script: turns every MDX lesson into a semantic search index for the
AI tutor. Chunks lessons by section, embeds each chunk with all-MiniLM-L6-v2
(local ONNX model, no API key needed) and writes public/tutor-index.json.

The tutor widget loads this file in the visitor's browser and matches the
student's question against it — retrieval is 100% client-side and free.

Run manually when lesson content changes:
    python3 scripts/build-tutor-index.py
Requires: a venv with onnxruntime, transformers, tokenizers, numpy, huggingface_hub.
"""
import json
import os
import re
import sys
from pathlib import Path

# huggingface_hub's httpx chokes on the sandbox's no_proxy value ([::1] etc.)
os.environ.pop("no_proxy", None)
os.environ.pop("NO_PROXY", None)

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
OUT = ROOT / "public" / "tutor-index.json"
MODEL_ID = "Xenova/all-MiniLM-L6-v2"
MAX_CHUNK = 1500  # characters; longer sections are split on paragraph breaks


def frontmatter(raw: str) -> dict:
    m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
    data = {}
    if m:
        for line in m.group(1).splitlines():
            kv = re.match(r'^(\w+):\s*"(.*)"\s*$', line) or re.match(r"^(\w+):\s*(.*?)\s*$", line)
            if kv:
                data[kv.group(1)] = kv.group(2)
    body = raw[m.end():] if m else raw
    return data, body


def clean_inline(t: str) -> str:
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)  # [text](url) -> text
    t = t.replace("**", "").replace("__", "")
    t = t.replace("`", "")
    t = re.sub(r"^#{1,4}\s*", "", t, flags=re.M)  # keep heading text, drop #'s
    t = re.sub(r"<br\s*/?>", " ", t)
    t = re.sub(r"&lt;", "<", t)
    t = re.sub(r"&gt;", ">", t)
    t = re.sub(r"&amp;", "&", t)
    return t.strip()


def mdx_to_text(body: str) -> str:
    # Drop diagrams (SVG internals are noise for retrieval)
    body = re.sub(r"<Diagram.*?</Diagram>", "", body, flags=re.S)

    # Practice Q&A pairs live in attributes — pull them into the text
    def practice(m):
        q = m.group(1)
        a = clean_inline(m.group(2))
        return f"\n\nPractice question: {q}\nAnswer: {a}\n"
    body = re.sub(r'<PracticeItem\s+question="([^"]*)">(.*?)</PracticeItem>', practice, body, flags=re.S)

    # Quiz questions similarly
    def quiz(m):
        q = m.group(1)
        exp = m.group(2)
        return f"\n\nQuiz: {q}\nExplanation: {exp}\n"
    body = re.sub(
        r'<QuizQuestion\s+question="([^"]*)"\s+options=\{[^}]*\}\s+answer=\{\d+\}\s+explanation="([^"]*)"[^/]*/>',
        quiz, body, flags=re.S)

    # Definitions: keep the term glued to its meaning
    body = re.sub(r'<Definition\s+term="([^"]*)">(.*?)</Definition>',
                  lambda m: f"\n\n{m.group(1)}: {clean_inline(m.group(2))}\n", body, flags=re.S)

    # Worked examples: keep the title as a mini-heading
    body = re.sub(r'<WorkedExample\s+title="([^"]*)">', r"\n\nWorked example — \1\n", body)

    # Drop remaining component wrappers but keep their inner text
    body = re.sub(r"</?(?:LearningObjectives|ImportantNote|PracticeQuestions|Quiz|CodeBlock|Summary|li)[^>]*>", "\n", body)
    body = re.sub(r"<[A-Za-z][A-Za-z0-9]*(\s[^<>]*)?/>", "", body)  # self-closing tags
    body = re.sub(r"</[A-Za-z][A-Za-z0-9]*>", "", body)

    # Normalise whitespace
    body = re.sub(r"[ \t]+", " ", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return clean_inline(body).strip()


def chunk_lesson(title: str, url: str, crumb: str, lede: str, text: str):
    """Split a lesson's text on ## headings; long sections split on paragraphs."""
    chunks = []
    sections = re.split(r"(?m)^##\s+", text)
    intro = sections[0].strip()
    if lede:
        intro = f"{lede}\n\n{intro}" if intro else lede
    if intro:
        chunks.append(("Overview", intro))
    for sec in sections[1:]:
        lines = sec.split("\n", 1)
        heading = lines[0].strip()
        body = lines[1].strip() if len(lines) > 1 else ""
        if not body:
            continue
        # Split over-long sections on paragraph boundaries
        while len(body) > MAX_CHUNK:
            cut = body.rfind("\n\n", 0, MAX_CHUNK)
            cut = cut if cut > 400 else MAX_CHUNK
            chunks.append((heading, body[:cut].strip()))
            body = body[cut:].strip()
        chunks.append((heading, body))
    out = []
    for i, (heading, body) in enumerate(chunks):
        if len(body) < 60:
            continue
        out.append({
            "id": f"{url}#{i}",
            "url": url,
            "lesson": title,
            "breadcrumb": crumb,
            "heading": heading,
            "text": f"{title} — {heading}. {crumb}. {body}",
        })
    return out


def lesson_url_and_crumb(path: Path):
    # content/subject/<subject>/grade-<n>/<chapter>/<topic>.mdx
    rel = path.relative_to(CONTENT / "subject")
    subject, grade_dir, chapter = rel.parts[0], rel.parts[1], rel.parts[2]
    topic = path.stem
    grade = grade_dir.replace("grade-", "")
    url = f"/subjects/{subject}/grade-{grade}/{chapter}/{topic}"
    return url, f"{subject} grade {grade} {chapter} {topic}"


def main():
    try:
        from transformers import AutoTokenizer
        import onnxruntime as ort
        import numpy as np
    except ImportError:
        sys.exit("Need onnxruntime, transformers, tokenizers, numpy, huggingface_hub in a venv.")

    files = sorted((CONTENT / "subject").rglob("*.mdx"))
    print(f"{len(files)} lesson files found")
    all_chunks = []
    for f in files:
        raw = f.read_text(encoding="utf8")
        meta, body = frontmatter(raw)
        title = meta.get("title", f.stem)
        lede = meta.get("lede", "")
        url, crumb = lesson_url_and_crumb(f)
        text = mdx_to_text(body)
        all_chunks.extend(chunk_lesson(title, url, crumb, lede, text))
    print(f"{len(all_chunks)} chunks")

    print(f"loading {MODEL_ID} …", flush=True)
    from huggingface_hub import snapshot_download
    snap = snapshot_download(MODEL_ID, allow_patterns=["onnx/model.onnx", "tokenizer.json", "config.json"])
    tok = AutoTokenizer.from_pretrained(snap)
    sess = ort.InferenceSession(
        f"{snap}/onnx/model.onnx",
        providers=["CPUExecutionProvider"],
    )

    def embed(texts):
        import numpy as np
        enc = tok(texts, padding=True, truncation=True, max_length=256, return_tensors="np")
        feed = {"input_ids": enc["input_ids"].astype(np.int64),
                "attention_mask": enc["attention_mask"].astype(np.int64)}
        if "token_type_ids" in [i.name for i in sess.get_inputs()]:
            feed["token_type_ids"] = np.zeros_like(feed["input_ids"])
        out = sess.run(None, feed)[0]
        mask = enc["attention_mask"][..., None]
        summed = (out * mask).sum(axis=1)
        counts = mask.sum(axis=1).clip(min=1e-9)
        emb = summed / counts
        emb = emb / np.linalg.norm(emb, axis=1, keepdims=True).clip(min=1e-9)
        return emb

    B = 32
    vecs = []
    for i in range(0, len(all_chunks), B):
        vecs.append(embed([c["text"] for c in all_chunks[i:i + B]]))
        print(f"  embedded {min(i + B, len(all_chunks))}/{len(all_chunks)}", flush=True)
    import numpy as np
    vecs = np.vstack(vecs)

    for c, v in zip(all_chunks, vecs):
        c["v"] = [round(float(x), 4) for x in v]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"model": MODEL_ID, "dims": 384,
                               "chunks": all_chunks}, ensure_ascii=False) + "\n",
                   encoding="utf8")
    kb = OUT.stat().st_size / 1024
    print(f"wrote {OUT} ({kb:.0f} KB)")

    # Sanity check: a few sample questions should retrieve the right lessons
    tests = [
        ("how do I convert binary to denary", "data-representation"),
        ("what is an AND gate", "logic-gates"),
        ("how do I make a loop in python", "python-programming"),
        ("what is DNS", "accessing-websites"),
    ]
    import numpy as np
    V = np.array([c["v"] for c in all_chunks])
    for q, expect in tests:
        qv = embed([q])[0]
        sims = V @ qv
        best = all_chunks[int(np.argmax(sims))]
        mark = "OK " if expect in best["url"] else "MISS"
        print(f"[{mark}] '{q}' -> {best['url']} ({sims.max():.2f})")


if __name__ == "__main__":
    main()
