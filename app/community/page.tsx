import { Section } from '@/components/Section';
import { links } from '@/lib/links';

export default function CommunityPage() {
  return (
    <Section title="커뮤니티" subtitle="기술 업데이트와 네트워크 상태 공유 채널입니다.">
      <div className="panel space-y-2 p-5 text-sm text-text">
        <p><a href={links.telegramNotice} target="_blank" rel="noreferrer" className="text-accent">텔레그램 공지 채널</a></p>
        <p><a href={links.telegramChat} target="_blank" rel="noreferrer" className="text-accent">텔레그램 채팅</a></p>
        <p><a href={links.kakaoChannel} target="_blank" rel="noreferrer" className="text-accent">카카오 채널</a></p>
        <p><a href={links.japanDiscordLanding} target="_blank" rel="noreferrer" className="text-accent">일본 커뮤니티 안내</a></p>
        <p className="pt-2 text-mute">운영 톤 가이드: 誇張しない。約束しない。続ける。</p>
      </div>
    </Section>
  );
}
