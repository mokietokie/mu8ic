import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: predictionId } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const musicId = searchParams.get('musicId');
  if (!musicId) {
    return NextResponse.json({ error: 'musicId is required' }, { status: 400 });
  }

  const prediction = await replicate.predictions.get(predictionId);

  if (prediction.status === 'succeeded') {
    // output은 URL 문자열 배열 또는 FileOutput 배열일 수 있음
    const output = prediction.output as Array<{ url: () => URL } | string>;
    const audioUrl = typeof output[0] === 'string' ? output[0] : output[0].url().toString();

    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      await supabase.from('musics').update({ status: 'failed' }).eq('id', musicId);
      return NextResponse.json({ status: 'failed', error: 'Failed to fetch audio from Replicate' });
    }
    const audioBuffer = await audioResponse.arrayBuffer();

    const filePath = `${user.id}/${musicId}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('musics')
      .upload(filePath, audioBuffer, { contentType: 'audio/mpeg', upsert: true });

    if (uploadError) {
      await supabase.from('musics').update({ status: 'failed' }).eq('id', musicId);
      return NextResponse.json({ status: 'failed', error: uploadError.message });
    }

    const { data: musicRecord } = await supabase
      .from('musics')
      .select('prompt')
      .eq('id', musicId)
      .single();

    const prompt = musicRecord?.prompt ?? '';
    const title = prompt.length > 60 ? prompt.slice(0, 60) + '...' : prompt;

    const { data: updated } = await supabase
      .from('musics')
      .update({ file_path: filePath, status: 'completed', title })
      .eq('id', musicId)
      .select()
      .single();

    const { data: signedUrl } = await supabase.storage
      .from('musics')
      .createSignedUrl(filePath, 3600);

    return NextResponse.json({ status: 'completed', music: updated, url: signedUrl?.signedUrl });
  }

  if (prediction.status === 'failed' || prediction.status === 'canceled') {
    await supabase.from('musics').update({ status: 'failed' }).eq('id', musicId);
    return NextResponse.json({ status: 'failed', error: prediction.error ?? 'Generation failed' });
  }

  // 'starting' | 'processing' — 아직 진행 중
  return NextResponse.json({ status: prediction.status });
}
