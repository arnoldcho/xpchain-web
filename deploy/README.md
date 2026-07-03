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

## 2. Nginx 차단 규칙 추가 (기존 config 에 include)

전체 config 를 새로 만들지 않고, 기존 443 server 블록에 스니펫만 끼워넣습니다.

```bash
# 스니펫 배치
sudo cp deploy/nginx-block-scanners.conf /etc/nginx/snippets/xpchain-block-scanners.conf

# rate limit 존 (http 컨텍스트)
echo 'limit_req_zone $binary_remote_addr zone=xpchain_rl:10m rate=20r/s;' \
  | sudo tee /etc/nginx/conf.d/xpchain-ratelimit.conf

# 기존 server { } (443) 안 맨 위에 아래 한 줄 추가:
#   include /etc/nginx/snippets/xpchain-block-scanners.conf;
sudoedit /etc/nginx/sites-enabled/<기존파일>     # 또는 nano 등으로 편집

sudo nginx -t && sudo systemctl reload nginx
```

동작 확인 — 악성 요청은 연결이 끊기고, 정상 페이지는 200:
```bash
curl -i "https://your-domain.com/_next/image?url=/xpc-logo.png%27%20AND%201=1"   # -> 빈 응답/연결 종료
curl -i "https://your-domain.com/"                                                # -> 200
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
