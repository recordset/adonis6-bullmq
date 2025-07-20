# Adonis6 BullMQ Setup

1. Install dependencies:
   ```bash
   npm install @recordset/adonis6-bullmq bullmq
   ```
2. Configure BullMQ:
   ```bash
   node ace configure @recordset/adonis6-bullmq
   ```
3. Edit `config/bullmq.ts` as needed.
4. Generate jobs with:
   ```bash
   node ace make:job MyJob
   ```
5. Start the worker:
   ```bash
   node ace bull:listen
   ```
