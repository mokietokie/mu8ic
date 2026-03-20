import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = await req.json();
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // DB에 generating 상태로 레코드 먼저 생성
  const { data: musicRecord, error: insertError } = await supabase
    .from('musics')
    .insert({ user_id: user.id, prompt, status: 'generating' })
    .select()
    .single();

  if (insertError || !musicRecord) {
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }

  try {
    const lyrics = `[inst]\n(${prompt})\n\n[verse]\n(${prompt}, building atmosphere)\n\n[chorus]\n(${prompt}, full energy)\n\n[inst]\n(gentle fade out)`;
    const caption = prompt;

    // 비동기 예측 생성 후 즉시 반환 (blocking하지 않음)
    const prediction = await replicate.predictions.create({
      version: 'fd851baef553cb1656f4a05e8f2f8641672f10bc808718f5718b4b4bb2b07794',
      input: { lyrics, caption, duration: 15, timeout_seconds: 90 },
    });

    return NextResponse.json({ predictionId: prediction.id, musicId: musicRecord.id });
  } catch (error) {
    await supabase.from('musics').update({ status: 'failed' }).eq('id', musicRecord.id);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to start generation', detail: message }, { status: 500 });
  }
}
