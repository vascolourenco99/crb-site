# Como ligar o Google Calendar ao site do CRB

Este guia explica como fazer os eventos do clube aparecerem automaticamente no site.
Sempre que alguém criar ou editar um evento no Google Calendar do clube, ele aparece no site sem tocar em mais nada.

> **Nota:** Se já fizeste o guia do Google Drive (`SETUP_GOOGLE_DRIVE.md`), já tens o projeto no Google Cloud criado e a API Key feita. Nesse caso **salta para o Passo 2** — só precisas de ativar mais uma API e configurar o calendário.

---

## Passo 1 — Ativar o Google Calendar API (Google Cloud)

> **Já tens o projeto criado?** Vai diretamente ao ponto 4.

1. Abre o browser e vai a **[console.cloud.google.com](https://console.cloud.google.com)**
2. Inicia sessão com a conta Google do clube
3. No topo, seleciona o projeto que criaste para o site (ex: `CRB Site`)
4. No menu do lado esquerdo, clica em **"APIs e serviços"** → **"Biblioteca"**
5. Na caixa de pesquisa, escreve `Google Calendar API` e carrega Enter
6. Clica no resultado **"Google Calendar API"** e depois no botão azul **"Ativar"**

> Se ainda não tens uma API Key criada, segue os passos 7–9 do `SETUP_GOOGLE_DRIVE.md` para criar uma. É a mesma chave para tudo.

---

## Passo 2 — Tornar o calendário público

> **O que vais fazer?** O site precisa de conseguir ler os eventos do calendário do clube. Para isso, o calendário tem de estar visível para toda a gente.

1. Abre o **[Google Calendar](https://calendar.google.com)** com a conta do clube
2. No painel da esquerda, encontra o calendário do clube (normalmente com o nome do clube)
3. Passa o rato por cima do nome e clica nos **três pontos** `⋮` que aparecem
4. Clica em **"Definições e partilha"**
5. Desce até à secção **"Permissões de acesso a eventos"**
6. Ativa a opção **"Disponibilizar para o público"**
7. Aparece um aviso — clica em **OK**

---

## Passo 3 — Copiar o ID do calendário

8. Ainda nas definições do calendário, desce até à secção **"Integrar calendário"**
9. Vai aparecer um campo chamado **"ID do calendário"** — o texto parece algo assim:
   ```
   abc123xyz456@group.calendar.google.com
   ```
   ou para o calendário principal da conta:
   ```
   nome@gmail.com
   ```
10. **Copia esse texto todo** e guarda num bloco de notas

---

## Passo 4 — Colocar o ID no ficheiro do site

1. Abre o ficheiro `index.html` com um editor de texto
2. Carrega **Ctrl+F** e procura por `ID_CALENDARIO_AQUI`
3. Vai aparecer esta linha:
   ```js
   id: 'ID_CALENDARIO_AQUI',
   ```
4. Substitui `ID_CALENDARIO_AQUI` pelo ID que copiaste, por exemplo:
   ```js
   id: 'abc123xyz456@group.calendar.google.com',
   ```
5. Confirma que a linha com a `apiKey` já tem a chave preenchida (do setup do Drive):
   ```js
   apiKey: 'AIzaSyDxyz1234abcDEF...',
   ```
6. Guarda o ficheiro (Ctrl+S)
7. Faz o upload do `index.html` atualizado para o servidor do site

---

## Como criar e gerir eventos no dia-a-dia

Depois de tudo configurado, o processo é simples:

1. Abre o **[Google Calendar](https://calendar.google.com)** com a conta do clube
2. Clica na data do evento para criar um novo evento
3. Preenche:
   - **Título** → nome do evento (ex: `Campeonato Regional 1/10 Elétrico`)
   - **Data e hora** → quando é o evento
   - **Local** → onde é o evento (ex: `Pista de Monsanto, Lisboa`)
   - **Descrição** → o **tipo** de evento — escreve apenas uma destas palavras:
     - `Treino`
     - `Competição`
     - `Workshop`
     - `Evento` (ou deixa vazio)
4. Clica em **Guardar**
5. Pronto — o evento aparece automaticamente no site

> **Atenção:** O site mostra os próximos 9 eventos a partir de hoje. Eventos passados desaparecem automaticamente.

---

## Problemas comuns

| Problema | Solução |
|---|---|
| Os eventos não aparecem | Confirma que o calendário está partilhado como público (Passo 2) |
| Aparece "Erro ao carregar eventos" | Verifica se a API Key está correta e se o "Google Calendar API" está ativado |
| O tipo de evento não aparece (ex: não aparece "Treino") | Certifica-te que escreveste o tipo no campo "Descrição" do evento |
| O evento tem o tipo errado | O campo Descrição tem de ter só a palavra do tipo na primeira linha |
