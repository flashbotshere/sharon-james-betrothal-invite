import { buildICS } from '@/lib/calendar';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildICS(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="betrothal-invite.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
