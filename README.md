# HSC AI Study Buddy

A mobile-friendly AI study chatbot for Maharashtra HSC Class 12 Science. It can help with Physics, Chemistry, Mathematics, Biology, English, revision, and questions students provide. It replies in English, Hindi, or Marathi.

## Sample question paper

[Open the Maharashtra HSC Class 12 Physics practice sample](papers/maharashtra-hsc-class12-physics-sample.md).

This is an AI-generated practice sample, not an official previous-year board paper.

## Deploy it with Vercel

This project needs server functions, so deploy it with Vercel rather than GitHub Pages.

1. Sign in to [Vercel](https://vercel.com/) with GitHub and import this repository.
2. In the Vercel project, open **Settings → Environment Variables**.
3. Add `OPENAI_API_KEY` with your own API key. Keep it private; do not add it to GitHub or share it in chat.
4. Optionally add `OPENAI_MODEL` with a model available to your API account. If omitted, the server uses `gpt-5-mini`.
5. Redeploy the project after setting the variables.
6. Open the Vercel deployment URL to use the chatbot.

The API key is read by the server function in `api/chat.js`; it is never sent to the browser. OpenAI API usage may incur charges. Set usage limits in your API account and monitor usage.

## Run locally

The UI can be opened as a file, but the AI endpoint needs a server environment. For local development, install the Vercel CLI, set `OPENAI_API_KEY` in your local environment, then run `vercel dev`.

## Notes

The chatbot answers from its model knowledge and the questions you type. It does not yet search or verify a library of official previous papers. Upload or paste a question for help, and verify syllabus details against current Maharashtra State Board materials.
