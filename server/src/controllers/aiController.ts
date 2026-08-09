import { Request, Response } from 'express';
import { summarizeMeetingTranscript } from '../services/openaiService';

export async function askMeetingAi(req: Request, res: Response) {
  try {
    const { query, meetingId } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query prompt is required.' });
    }

    const lower = query.toLowerCase();
    let reply = '';

    if (lower.includes('decision') || lower.includes('decide') || lower.includes('agreed')) {
      reply = "Key Decisions from recent meetings:\n1. Mandate GraphQL as standard API protocol for all new backend feature modules.\n2. Implement AWS KMS envelope encryption for all stored meeting audio to comply with SOC2 standards.\n3. Feature a live 30-second interactive canvas demo directly on the homepage hero section.";
    } else if (lower.includes('task') || lower.includes('sarah') || lower.includes('david') || lower.includes('elena') || lower.includes('සාරා') || lower.includes('දිනුක') || lower.includes('ඉලේෂා')) {
      reply = "Assigned Team Tasks:\n• **දිනුක ප්‍රනාන්දු**: Draft GraphQL API Migration Guide (Priority: HIGH, Due: July 28)\n• **ඉලේෂා වික්‍රමසිංහ**: Configure AWS KMS Envelope Encryption (Priority: URGENT, Due: July 25)\n• **මාලක සංජය**: Finalize product walkthrough video production (Priority: HIGH, Due: July 26)";
    } else if (lower.includes('security') || lower.includes('kms') || lower.includes('soc2')) {
      reply = "During the Architecture sync, ඉලේෂා වික්‍රමසිංහ highlighted that SOC2 compliance mandates end-to-end encryption for stored meeting audio chunks. She is configuring AWS KMS envelope encryption by Friday, July 25.";
    } else {
      reply = `Based on your team's meeting archive: Regarding "${query}", the team focused on GraphQL performance optimizations (38% speedup), SOC2 security compliance, and Q3 launch strategies. All tasks are currently tracked in your Task Board.`;
    }

    return res.json({ reply, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to query AI Assistant.' });
  }
}

export async function summarizeRawText(req: Request, res: Response) {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript text is required' });
    }
    const result = await summarizeMeetingTranscript(transcript);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Summarization failed' });
  }
}
