# Como ligar o Google Drive ao site do CRB

Este guia explica como fazer os documentos do clube aparecerem automaticamente no site.
Sempre que alguém fizer upload de um ficheiro para a pasta certa no Google Drive, ele aparece no site sem tocar em mais nada.

---

## Passo 1 — Criar uma chave de acesso no Google Cloud

> **O que é isto?** O site precisa de uma "chave" para poder ler os ficheiros do Drive. Vais buscar essa chave ao Google Cloud, que é gratuito.

1. Abre o browser e vai a **[console.cloud.google.com](https://console.cloud.google.com)**
2. Inicia sessão com a conta Google do clube
3. No topo da página, clica em **"Selecionar projeto"** → **"Novo projeto"**
   - Dá um nome, por exemplo: `CRB Site`
   - Clica em **Criar**
4. No menu do lado esquerdo, clica em **"APIs e serviços"** → **"Biblioteca"**
5. Na caixa de pesquisa, escreve `Google Drive API` e carrega Enter
6. Clica no resultado **"Google Drive API"** e depois no botão azul **"Ativar"**
7. Agora vai a **"APIs e serviços"** → **"Credenciais"**
8. Clica em **"+ Criar credenciais"** → **"Chave de API"**
9. Aparece uma janela com a chave — **copia esse texto todo** (começa por `AIzaSy...`) e guarda num bloco de notas

### Restringir a chave (importante para segurança)

10. Na lista de credenciais, clica no lápis ✏️ ao lado da chave que acabaste de criar
11. Em **"Restrições de aplicações"**, escolhe **"Referenciadores HTTP (sites)"**
12. Em **"Restrições de API"**, escolhe **"Restringir chave"** → seleciona **"Google Drive API"**
13. Clica em **Guardar**

---

## Passo 2 — Criar as pastas no Google Drive

> **O que vais fazer?** Criar uma pasta por ano no Google Drive e torná-la pública para o site conseguir ler os ficheiros.

1. Abre o **[Google Drive](https://drive.google.com)** com a conta do clube
2. Clica em **"+ Novo"** → **"Pasta"**
3. Chama-lhe `CRB Documentos 2025` e clica em **Criar**
4. Repete o passo 2 e 3 para os outros anos: `CRB Documentos 2024`, `CRB Documentos 2023`, etc.

### Tornar cada pasta pública

Faz isto para **cada pasta** que criaste:

5. Clica com o botão direito do rato na pasta → **"Partilhar"**
6. Em baixo, onde diz **"Acesso geral"**, clica no menu que diz "Restrito" e muda para **"Qualquer pessoa com o link"**
7. Confirma que o papel à direita diz **"Visualizador"** (não "Editor")
8. Clica em **Concluído**

### Copiar o ID de cada pasta

9. Abre cada pasta (duplo clique)
10. Olha para o URL no browser — vai ser algo assim:
    ```
    https://drive.google.com/drive/folders/1BxiMVs0XyZabcDEFghijk
    ```
11. A parte depois de `/folders/` é o **ID da pasta** — copia e guarda para cada ano

---

## Passo 3 — Colocar as chaves no ficheiro do site

1. Abre o ficheiro `index.html` com um editor de texto (por exemplo, o Notepad++ ou o VS Code)
2. Carrega **Ctrl+F** para abrir a pesquisa e procura por `CHAVE_API_AQUI`
3. Vai aparecer esta secção no início do código:

```js
const GDRIVE_API_KEY    = 'CHAVE_API_AQUI';
const GDRIVE_FOLDER_IDS = {
  '2025': 'ID_PASTA_2025',
  '2024': 'ID_PASTA_2024',
  '2023': 'ID_PASTA_2023',
  '2022': 'ID_PASTA_2022',
};
```

4. Substitui `CHAVE_API_AQUI` pela chave que copiaste no Passo 1, por exemplo:
```js
const GDRIVE_API_KEY = 'AIzaSyDxyz1234abcDEF...';
```

5. Substitui cada `ID_PASTA_XXXX` pelo ID da pasta correspondente, por exemplo:
```js
const GDRIVE_FOLDER_IDS = {
  '2025': '1BxiMVs0XyZabcDEFghijk',
  '2024': '1Hjk9MnPqRstuvWXyz5678',
  '2023': '1Abcd1234EfghIJKLmnop',
  '2022': '1Qrst5678UvwxYZab9012',
};
```

6. Guarda o ficheiro (Ctrl+S)
7. Faz o upload do `index.html` atualizado para o servidor do site

---

## Como adicionar documentos no dia-a-dia

Depois de tudo configurado, o processo é simples:

1. Abre o Google Drive com a conta do clube
2. Entra na pasta do ano correto (ex: `CRB Documentos 2025`)
3. Arrasta o ficheiro PDF para dentro da pasta (ou clica em **"+ Novo"** → **"Envio de ficheiro"**)
4. Pronto — o documento aparece automaticamente no site

> **Nota:** O nome do ficheiro que dás no Drive é o nome que aparece no site. Usa nomes claros, por exemplo: `Ata AG Março 2025.pdf`

---

## Problemas comuns

| Problema | Solução |
|---|---|
| Os documentos não aparecem | Confirma que a pasta está partilhada como "Qualquer pessoa com o link" |
| Aparece "Erro ao carregar documentos" | A chave de API pode estar errada ou a Drive API não está ativada |
| Os documentos aparecem mas não abrem | O ficheiro pode não estar partilhado individualmente — verifica as permissões da pasta |
