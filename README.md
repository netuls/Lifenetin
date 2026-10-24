# Círculo (app nativo) — avisos sempre, mesmo com o app fechado

Mesmo código do PWA, empacotado com Capacitor. Localização em segundo plano + notificação push (Firebase).

## Etapa 1 — Firebase (uma vez)
1. Console Firebase > projeto `lifenetin` > Configurações do projeto > **Adicionar app > Android**.
   Nome do pacote: `com.netuls.circulo`. Baixe o `google-services.json`.
2. Mude o plano para **Blaze** (pede cartão; uma família costuma ficar dentro da cota gratuita). É necessário para as Functions.
3. No seu computador, na pasta do projeto:
   ```
   npm install -g firebase-tools
   firebase login
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```
4. Regras do Firestore: as mesmas de antes (`request.auth != null` em `circles/{code}/{col}/{doc}`).

## Etapa 2 — APK Android (grátis, feito no GitHub)
1. Converta o `google-services.json` em texto: no PowerShell, `[Convert]::ToBase64String([IO.File]::ReadAllBytes("google-services.json"))`.
2. Suba este projeto para um repositório do GitHub. Em **Settings > Secrets and variables > Actions > New secret**, crie `GOOGLE_SERVICES_JSON` com o texto do passo anterior.
3. Aba **Actions > Build Android APK > Run workflow**. Em ~5 min, baixe o `circulo-apk` em Artifacts, extraia e instale o `app-debug.apk` nos celulares (permita "instalar apps desconhecidos").
4. No celular: ao abrir, permita a localização **"o tempo todo"** e as notificações. Em Configurações > Bateria, deixe o Círculo como **"Sem restrições"**, senão alguns Androids (Xiaomi, Samsung, Motorola) encerram o app.

## iPhone (não automatizado)
Exige: conta Apple Developer (US$ 99/ano) e um Mac (ou serviço de build em nuvem, como o Codemagic). Passos: `npx cap add ios`, adicionar o app iOS no Firebase (`GoogleService-Info.plist`), enviar a chave APNs ao Firebase (Configurações > Cloud Messaging), ativar "Background Modes > Location updates" e "Push Notifications" no Xcode, e aplicar os ajustes do AppDelegate descritos na documentação do plugin `@capacitor-firebase/messaging`. Distribuição pelo TestFlight.
