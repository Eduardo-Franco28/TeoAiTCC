# TeoAiTCC

Teo Web: o site do Teo, o assistente com IA do IntegraMente. É a área do adulto: conversar com o Teo, ver a prévia das atividades que ele cria, aprovar, descartar e remover atividades da conta.

O acesso é sempre pelo app IntegraMente: o adulto toca em **Teo** no perfil, digita o PIN e o app abre este site com um código de uso único, que vira um token válido por 1 hora e renovado enquanto o site está aberto.

## Stack

- React 19 + TypeScript + Vite
- Fala com dois backends: o Spring do IntegraMente (`app-mobile-tcc`) e o backend do Teo (`TeoTCC`)

## Rodando localmente

1. Copie `.env.example` para `.env` e aponte para os dois backends:

   ```
   VITE_INTEGRAMENTE_API_URL=http://localhost:8080
   VITE_TEO_API_URL=http://localhost:8000
   ```

   Para abrir pelo celular, use o IP da máquina no lugar de `localhost`.

2. Instale e suba (porta 5173, acessível na rede local):

   ```bash
   npm install
   npm run dev
   ```

3. Os dois backends precisam liberar a origem do site no CORS (`TEO_WEB_ORIGINS`).

## Telas

| Tela | O que faz |
| --- | --- |
| Conversa | chat com o Teo, com o cartão de prévia de cada rascunho criado |
| Atividades | atividades da conta: as que esperam aprovação e as que já estão no app |

Sem o código do app, o site mostra como entrar. Quando a sessão vence, pede para voltar ao app.
