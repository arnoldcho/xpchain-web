import { Section } from '@/components/Section';
import { links } from '@/lib/links';

export default function CommunityPage() {
  return (
    <>
      <h1 className="sr-only">커뮤니티</h1>
      <Section title="커뮤니티" subtitle="기술 업데이트와 네트워크 상태 공유 채널입니다.">
        <div className="panel space-y-2 p-5 text-sm text-text">
          <p><a href={links.telegramNotice} target="_blank" rel="noreferrer" className="text-accent">텔레그램 공지 채널</a></p>
          <p><a href={links.telegramChat} target="_blank" rel="noreferrer" className="text-accent">텔레그램 채팅</a></p>
          <p><a href={links.kakaoChannel} target="_blank" rel="noreferrer" className="text-accent">카카오 채널</a></p>
          <p><a href={links.japanDiscordLanding} target="_blank" rel="noreferrer" className="text-accent">디스코드(일본)</a></p>
        </div>
      </Section>
    </>
  );
}
