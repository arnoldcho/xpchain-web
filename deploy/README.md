# 배포 / 엣지 차단 설정 (Cloudflare 없이)

현재 서버 구성 (확인됨):
- **Nginx** 가 80/443 서비스 중.
- **next-server** 가 3000 포트에서 실행.  ⚠️ `*:3000`(모든 인터페이스)로 열려 있어
  `http://서버IP:3000` 으로 Nginx 를 우회할 수 있으므로 **loopback 으로 제한**해야 함.

방어 2단: **Nginx** 가 악성 요청을 즉시 드롭 + **fail2ban** 이 반복 IP 를 방화벽에서 밴.

---

## 1. (필수) 3000 포트 외부 노출 차단

`ecosystem.config.cjs` 에서 앱을 `127.0.0.1:3000` 으로만 바인딩하도록 이미 수정했습니다
(`start -p 3000 -H 127.0.0.1`). 서버에서 반영:

```bash
cd ~/xpchain-web && git pull
npm run build
pm2 delete xpchain-web && pm2 start ecosystem.config.cjs --only xpchain-web
pm2 save
# 확인: 3000 이 127.0.0.1 로만 떠야 함
sudo ss -tlnp | grep ':3000'      # -> 127.0.0.1:3000 (0.0.0.0/* 아니어야 함)
```

방화벽에서도 3000 외부 접근 차단(있다면):
```bash
sudo ufw deny 3000
```

## 2. Nginx 차단 규칙 추가 (기존 xpchain-www 블록에 include)

이 서버는 두 사이트가 공존한다:
- `sites-enabled/wallet` → wallet.xpchain.co.kr → localhost:3001 (웹월렛, 별도 앱)
- `sites-enabled/xpchain-www` → xpchain.co.kr / www.xpchain.co.kr → 127.0.0.1:3000 (**이 Next 앱**)

스캐너 트래픽은 xpchain-www(3000) 로 오므로 그 443 server 블록에만 넣는다.

```bash
# (0) 최신 스니펫 받기
cd ~/xpchain-web && git pull

# (1) 스니펫 + rate limit 존 배치
sudo cp deploy/nginx-block-scanners.conf /etc/nginx/snippets/xpchain-block-scanners.conf
echo 'limit_req_zone $binary_remote_addr zone=xpchain_rl:10m rate=20r/s;' \
  | sudo tee /etc/nginx/conf.d/xpchain-ratelimit.conf

# (2) 443 server 블록의 server_name 바로 뒤에 include 한 줄 삽입 (백업 .bak 자동 생성).
#     0,/re/ 주소로 '첫 번째' server_name(=443 블록)에만 넣는다.
sudo sed -i.bak '0,/server_name xpchain\.co\.kr www\.xpchain\.co\.kr;/s//&\n    include \/etc\/nginx\/snippets\/xpchain-block-scanners.conf;/' \
  /etc/nginx/sites-available/xpchain-www

# (3) 검증 후 반영
sudo nginx -t && sudo systemctl reload nginx
```

동작 확인 — 악성 요청은 연결이 끊기고(빈 응답), 정상 페이지는 200:
```bash
curl -si "https://www.xpchain.co.kr/_next/image?url=/xpc-logo.png%27%20AND%201=1" | head -1  # -> 비어있음/끊김
curl -si "https://www.xpchain.co.kr/" | head -1                                              # -> HTTP/2 200
```

문제가 생기면 즉시 되돌리기:
```bash
sudo cp /etc/nginx/sites-available/xpchain-www.bak /etc/nginx/sites-available/xpchain-www
sudo nginx -t && sudo systemctl reload nginx
```

## 3. fail2ban 설치·적용

```bash
sudo apt install -y fail2ban
sudo cp deploy/fail2ban/filter.d/xpchain-web.conf /etc/fail2ban/filter.d/xpchain-web.conf
sudo cp deploy/fail2ban/jail.d/xpchain-web.conf   /etc/fail2ban/jail.d/xpchain-web.conf
sudo systemctl restart fail2ban

sudo fail2ban-client status xpchain-web           # 밴된 IP 목록
sudo fail2ban-client set xpchain-web unbanip <IP> # 오탐 해제
```

> nginx 로그 경로/포맷이 다르면 `jail.d/xpchain-web.conf` 의 `logpath`,
> `filter.d/xpchain-web.conf` 의 `failregex` 를 조정하세요.
> 테스트: `fail2ban-regex /var/log/nginx/access.log /etc/fail2ban/filter.d/xpchain-web.conf`

---

## 참고: 앱 레벨 방어

`proxy.ts` 미들웨어가 이미 `/_next/image` 의 잘못된/악성 `url` 을 400 으로 막아
`URIError` 로그 소음을 제거합니다. Nginx/fail2ban 은 그 앞단에서 트래픽을 줄이고
반복 공격 IP 를 차단하는 역할입니다.
