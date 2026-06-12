# 📋 Relatório de Análise Completa do Projeto

> **Sistema Analisado:** FilmesMoura — Sistema de Gerenciamento de Filmes e Gêneros  
> **Objetivo:** Adaptar o sistema para gerenciamento de **Veículos**  
> **Data da Análise:** 12/06/2026  
> **Analista:** Antigravity (Senior Full Stack AI Assistant)

---

## 1. ESTRUTURA DO PROJETO

### 1.1 Árvore de Pastas

```
Projeto_Veiculo/
├── Banco de Dados/                          ← Pasta vazia (banco gerenciado via SQL)
├── ProjetoFilme/                            ← BACK-END (ASP.NET Core Web API)
│   ├── DDL_Filmes.sql                       ← Script de criação do banco de dados
│   └── FilmesMoura.WebAPI/
│       └── FilmesMoura.WebAPI/              ← Projeto principal da API
│           ├── BdContextFilme/
│           │   └── FilmeContext.cs          ← DbContext (Entity Framework Core)
│           ├── Controllers/
│           │   ├── FilmeController.cs       ← Endpoints de Filme
│           │   ├── GeneroController.cs      ← Endpoints de Gênero
│           │   ├── LoginController.cs       ← Autenticação JWT
│           │   └── UsuarioController.cs     ← Cadastro de usuário
│           ├── DTO/
│           │   ├── FilmeDTO.cs              ← DTO de criação/edição de Filme
│           │   └── LoginDTO.cs              ← DTO de login
│           ├── Interfaces/
│           │   ├── IFilmeRepository.cs      ← Contrato do repositório de Filme
│           │   ├── IGeneroRepository.cs     ← Contrato do repositório de Gênero
│           │   └── IUsuarioRepository.cs    ← Contrato do repositório de Usuário
│           ├── Models/
│           │   ├── Filme.cs                 ← Entidade Filme
│           │   ├── Genero.cs                ← Entidade Gênero
│           │   └── Usuario.cs               ← Entidade Usuário
│           ├── NovaPasta/                   ← Excluída do build (ignorada pelo .csproj)
│           ├── Repository/
│           │   ├── FilmeRepository.cs       ← Implementação do repositório de Filme
│           │   ├── GeneroRepository.cs      ← Implementação do repositório de Gênero
│           │   └── UsuarioRepository.cs     ← Implementação do repositório de Usuário
│           ├── Utils/
│           │   └── Criptografia.cs          ← Helper de hash/verificação BCrypt
│           ├── appsettings.json             ← Connection String e configurações
│           ├── FilmesMoura.WebAPI.csproj    ← Dependências NuGet
│           └── Program.cs                   ← Bootstrap da aplicação
│
└── Projeto_Veiculo/
    └── Filme/                               ← FRONT-END (React 19 + Vite 8)
        ├── index.html                       ← Entry HTML
        ├── vite.config.js                   ← Configuração do Vite
        ├── package.json                     ← Dependências npm
        ├── db.json                          ← Mock data do json-server (dev)
        └── src/
            ├── App.jsx                      ← Componente raiz
            ├── main.jsx                     ← Ponto de entrada React
            ├── index.css                    ← Estilos globais
            ├── App.css                      ← Estilos do App (vazio)
            ├── Routes/
            │   └── routes.jsx               ← Definição de rotas
            ├── assets/
            │   └── img/
            │       ├── fundoLogin.png       ← Imagem de fundo da tela de login
            │       ├── logo.svg             ← Logo da aplicação
            │       ├── pen-to-square-solid.svg  ← Ícone editar
            │       └── trash-can-regular.svg    ← Ícone excluir
            ├── components/
            │   ├── alerta/
            │   │   ├── Alerta.jsx           ← Wrapper do SweetAlert2
            │   │   └── Alerta.css
            │   ├── botao/
            │   │   ├── Botao.jsx            ← Botão genérico (submit/cancelar)
            │   │   └── Botao.css
            │   ├── cadastro/
            │   │   ├── Cadastro.jsx         ← Formulário genérico (reutilizável)
            │   │   └── Cadastro.css
            │   ├── footer/
            │   │   ├── Footer.jsx           ← Rodapé global
            │   │   └── Footer.css
            │   ├── header/
            │   │   ├── Header.jsx           ← Cabeçalho global com navegação
            │   │   └── Header.css
            │   ├── lista/
            │   │   ├── Lista.jsx            ← Tabela genérica (reutilizável)
            │   │   └── Lista.css
            │   └── routes/
            │       └── PrivateRoute.jsx     ← Proteção de rotas autenticadas
            ├── context/
            │   ├── UsuarioContext.jsx       ← Criação do contexto de usuário
            │   └── UsuarioProvider.jsx      ← Provider com lógica de autenticação
            ├── pages/
            │   ├── CadastroFilme/
            │   │   ├── CadastroFilme.jsx    ← Página de CRUD de Filmes
            │   │   └── CadastroFilme.css
            │   ├── CadastroGenero/
            │   │   ├── CadastroGenero.jsx   ← Página de CRUD de Gêneros
            │   │   └── CadastroGenero.css
            │   └── Login/
            │       ├── Login.jsx            ← Página de login
            │       └── Login.css
            └── services/
                └── Services.js              ← Instância Axios + configuração de API
```

### 1.2 Função de Cada Pasta

| Pasta (Back-End) | Função |
|---|---|
| `BdContextFilme/` | Contexto do Entity Framework Core; mapeia entidades para tabelas SQL |
| `Controllers/` | Recebe requisições HTTP e retorna respostas; camada de entrada da API |
| `DTO/` | Objetos de transferência de dados; desacopla o input externo das entidades internas |
| `Interfaces/` | Contratos que definem os métodos dos repositórios (princípio DIP) |
| `Models/` | Entidades que refletem diretamente as tabelas do banco de dados |
| `Repository/` | Implementação da lógica de acesso ao banco de dados |
| `Utils/` | Funções auxiliares reutilizáveis (ex: criptografia) |

| Pasta (Front-End) | Função |
|---|---|
| `Routes/` | Configuração central das rotas SPA |
| `assets/` | Recursos estáticos (imagens, ícones, SVGs) |
| `components/` | Componentes React reutilizáveis e independentes de domínio |
| `context/` | Gerenciamento de estado global (autenticação) via React Context API |
| `pages/` | Componentes de nível de página (compostos por components) |
| `services/` | Configuração e instância do cliente HTTP (Axios) |

---

## 2. BANCO DE DADOS

### 2.1 Tabelas Existentes

**Arquivo:** [`DDL_Filmes.sql`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/DDL_Filmes.sql)  
**Banco:** `FilmesBD_Moura` — SQL Server (LocalDB)

### 2.2 Estrutura Detalhada das Tabelas

#### Tabela: `Genero`
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `IdGenero` | `VARCHAR(40)` | `PRIMARY KEY NOT NULL` | Identificador único (GUID como string) |
| `Nome` | `VARCHAR(100)` | `NOT NULL` | Nome do gênero cinematográfico |

#### Tabela: `Filme`
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `IdFilme` | `VARCHAR(40)` | `PRIMARY KEY NOT NULL` | Identificador único (GUID como string) |
| `Titulo` | `VARCHAR(100)` | `NOT NULL` | Título do filme |
| `Imagem` | `VARCHAR(100)` | `NULL` | Nome do arquivo de imagem (salvo em `wwwroot/imagens/`) |
| `IdGenero` | `VARCHAR(40)` | `FK → Genero(IdGenero)` | Referência ao gênero do filme |

#### Tabela: `Usuario`
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `IdUsuario` | `VARCHAR(40)` | `PRIMARY KEY NOT NULL` | Identificador único (GUID como string) |
| `Nome` | `VARCHAR(100)` | `NOT NULL` | Nome completo do usuário |
| `Senha` | `VARCHAR(60)` | `NOT NULL` | Senha com hash BCrypt |
| `Email` | `VARCHAR(256)` | `UNIQUE NOT NULL` | Email (usado como login) |

### 2.3 Relacionamentos

```
Genero (1) ─────────── (N) Filme
   IdGenero ──── FK ──→ IdGenero
```

- **Cardinalidade:** Um gênero pode ter muitos filmes (1:N)
- **Tipo:** `FOREIGN KEY` referenciando `Genero(IdGenero)`
- **Comportamento no EF Core:** Configurado com `HasOne → WithMany` e `[JsonIgnore]` para evitar ciclo de serialização
- A tabela `Usuario` é **independente** — não se relaciona com `Filme` nem `Genero`

---

## 3. BACK-END

### 3.1 Models

**Localização:** [`Models/`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/FilmesMoura.WebAPI/FilmesMoura.WebAPI/Models)

#### `Filme.cs`
```
IdFilme   → string? (PK, VARCHAR 40)
Titulo    → string  (NOT NULL, VARCHAR 100)
Imagem    → string? (VARCHAR 100) — nome do arquivo físico
IdGenero  → string? (FK → Genero)
IdGeneroNavigation → virtual Genero? [JsonIgnore]
```

#### `Genero.cs`
```
IdGenero → string? (PK, VARCHAR 40)
Nome     → string  (NOT NULL, VARCHAR 100)
Filmes   → ICollection<Filme> [JsonIgnore] — propriedade de navegação
```

#### `Usuario.cs`
```
IdUsuario → string? (PK, VARCHAR 40)
Nome      → string  (NOT NULL, VARCHAR 100)
Senha     → string  (NOT NULL, VARCHAR 60) — hash BCrypt
Email     → string  (NOT NULL, VARCHAR 256) — UNIQUE INDEX
```

### 3.2 DbContext

**Arquivo:** [`BdContextFilme/FilmeContext.cs`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/FilmesMoura.WebAPI/FilmesMoura.WebAPI/BdContextFilme/FilmeContext.cs)

- Herda de `DbContext`
- Registra 3 `DbSet<T>`: `Filmes`, `Generos`, `Usuarios`
- Connection string configurada em `appsettings.json` via `Name=DefaultConnection`
- `OnModelCreating` configura PK e FK nomeadas explicitamente

### 3.3 DTOs

**Localização:** [`DTO/`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/FilmesMoura.WebAPI/FilmesMoura.WebAPI/DTO)

#### `FilmeDTO.cs`
```
Titulo   → string?    — nome do filme
Imagem   → IFormFile? — arquivo de imagem (multipart/form-data)
IdGenero → Guid?      — ID do gênero selecionado
```
> Motivo: usado em `[FromForm]` para suportar upload de imagem

#### `LoginDTO.cs`
```
Email → string? [Required] — email do usuário
Senha → string? [Required] — senha em texto plano
```

### 3.4 Interfaces

**Localização:** [`Interfaces/`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/FilmesMoura.WebAPI/FilmesMoura.WebAPI/Interfaces)

#### `IFilmeRepository`
| Método | Descrição |
|---|---|
| `void Cadastrar(Filme)` | Insere novo filme com novo GUID |
| `List<Filme> Listar()` | Retorna todos os filmes |
| `Filme BuscarPorId(Guid)` | Busca filme por ID |
| `void AtualizarIdUrl(Guid, Filme)` | Atualiza filme via ID na URL |
| `void AtualizarIdCorpo(Filme)` | Atualiza filme via ID no corpo |
| `void Deletar(Guid)` | Remove filme pelo ID |

#### `IGeneroRepository`
| Método | Descrição |
|---|---|
| `void Cadastrar(Genero)` | Insere novo gênero com novo GUID |
| `List<Genero> Listar()` | Retorna todos os gêneros |
| `Genero BuscarPorId(Guid)` | Busca gênero por ID |
| `void AtualizarIdUrl(Guid, Genero)` | Atualiza gênero via ID na URL |
| `void AtualizarIdCorpo(Genero)` | Atualiza gênero via ID no corpo |
| `void Deletar(Guid)` | Remove gênero pelo ID |

#### `IUsuarioRepository`
| Método | Descrição |
|---|---|
| `void Cadastrar(Usuario)` | Cadastra usuário com hash da senha |
| `Usuario BuscarPorId(Guid)` | **NÃO IMPLEMENTADO** (`throw NotImplementedException`) |
| `Usuario BuscarPorEmailESenha(string, string)` | Autentica usuário via email + BCrypt |

### 3.5 Repositories

**Localização:** [`Repository/`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/FilmesMoura.WebAPI/FilmesMoura.WebAPI/Repository)

Todos injetam `FilmeContext` via construtor (Dependency Injection).

**Observação crítica em `GeneroRepository.Listar()`:** O método tem um bug — faz `ToList()` dentro do `try`, ignora o resultado, e faz um segundo `ToList()` fora do bloco. Funcionalmente correto, mas ineficiente e confuso.

### 3.6 Utils

**Arquivo:** [`Utils/Criptografia.cs`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/ProjetoFilme/FilmesMoura.WebAPI/FilmesMoura.WebAPI/Utils/Criptografia.cs)

Classe estática com dois métodos:
- `GerarHash(string senha)` → `BCrypt.Net.BCrypt.HashPassword()`
- `CompararHash(string senhaForm, string senhaBanco)` → `BCrypt.Net.BCrypt.Verify()`

### 3.7 Endpoints Existentes

**Base URL:** `http://localhost:5182/api`

#### FilmeController — `[Route("api/filmes")]`
| Método | Rota | Descrição | Body | Auth |
|---|---|---|---|---|
| `GET` | `/api/filmes` | Lista todos os filmes | — | Não (comentado) |
| `GET` | `/api/filmes/{id}` | Busca filme por ID | — | Não |
| `POST` | `/api/filmes` | Cadastra novo filme | `multipart/form-data` (FilmeDTO) | Não |
| `PUT` | `/api/filmes/{id}` | Atualiza filme por ID | `multipart/form-data` (FilmeDTO) | Não |
| `PUT` | `/api/filmes` | Atualiza filme por corpo | `JSON` (Filme) | Não |
| `DELETE` | `/api/filmes/{id}` | Exclui filme e imagem | — | Não |

> ⚠️ Há dois métodos `PUT` — um com `{id}` na URL (usado pelo Front-End) e outro com ID no corpo (não usado pelo Front-End).

#### GeneroController — `[Route("api/generos")]`
| Método | Rota | Descrição | Body | Auth |
|---|---|---|---|---|
| `GET` | `/api/generos` | Lista todos os gêneros | — | Não |
| `GET` | `/api/generos/{id}` | Busca gênero por ID | — | Não |
| `POST` | `/api/generos` | Cadastra novo gênero | `JSON` (Genero) | Não |
| `PUT` | `/api/generos/{id}` | Atualiza gênero por ID | `JSON` (Genero) | Não |
| `PUT` | `/api/generos` | Atualiza gênero por corpo | `JSON` (Genero) | Não |
| `DELETE` | `/api/generos/{id}` | Exclui gênero | — | Não |

#### LoginController — `[Route("api/[controller]")]`
| Método | Rota | Descrição | Body |
|---|---|---|---|
| `POST` | `/api/Login` | Autentica e retorna token JWT | `JSON` (LoginDTO) |

#### UsuarioController — `[Route("api/[controller]")]`
| Método | Rota | Descrição | Body |
|---|---|---|---|
| `POST` | `/api/Usuario` | Cadastra novo usuário | `JSON` (Usuario) |

### 3.8 Dependências NuGet (.csproj)

| Pacote | Versão | Função |
|---|---|---|
| `BCrypt.Net-Next` | 4.1.0 | Hashing de senhas |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 10.0.3 | Autenticação JWT |
| `Microsoft.EntityFrameworkCore` | 10.0.3 | ORM principal |
| `Microsoft.EntityFrameworkCore.SqlServer` | 10.0.3 | Provider SQL Server |
| `Microsoft.EntityFrameworkCore.Tools` | 10.0.3 | Migrations via CLI |
| `Swashbuckle.AspNetCore` | 10.1.4 | Swagger/OpenAPI UI |
| `System.IdentityModel.Tokens.Jwt` | 8.16.0 | Geração de tokens JWT |

### 3.9 Configuração (Program.cs)

- **Framework:** .NET 10
- **DI registrado:** `FilmeContext`, `IFilmeRepository`, `IGeneroRepository`, `IUsuarioRepository`
- **JWT:** configurado com chave `"filmes-chave-autenticacao-webapi-dev"`, issuer/audience `"api_filmes"`, expiração 5 min
- **CORS:** `AllowAll` — aceita qualquer origem, header e método
- **Static Files:** habilitado (`UseStaticFiles`) para servir imagens de `wwwroot/imagens/`
- **Swagger:** habilitado apenas em `Development`, acessível na raiz `/`

### 3.10 Fluxo de Funcionamento (Back-End)

```
[Requisição HTTP]
      ↓
[Controller]  ←── recebe e valida dados
      ↓
[Interface]   ←── define o contrato
      ↓
[Repository]  ←── executa a lógica de acesso ao banco
      ↓
[FilmeContext] ←── DbContext do EF Core
      ↓
[SQL Server]
```

---

## 4. FRONT-END

### 4.1 Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19.2.6 | Framework UI |
| Vite | 8.0.12 | Build tool e dev server |
| React Router DOM | 7.15.1 | Roteamento SPA |
| Axios | 1.16.1 | Cliente HTTP |
| SweetAlert2 | 11.26.25 | Modais e alertas |
| jwt-decode | 4.0.0 | Decodificar token JWT |
| json-server | 1.0.0-beta | Mock de API para desenvolvimento |

### 4.2 Telas Existentes

#### Tela: Login (`/`)
**Arquivo:** [`pages/Login/Login.jsx`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/Projeto_Veiculo/Filme/src/pages/Login/Login.jsx)

- Layout dividido: banner com imagem de fundo à esquerda, formulário à direita
- Cor predominante: `#CC3F55` (vermelho)
- Verifica login salvo no `localStorage` no `useEffect` (auto-redirect)
- Após login, navega para `/generos`
- **Bug identificado:** O front-end chama `api.post("/Login", dadosLogin)` mas espera `retornoAPI.data` como token direto (`jwtDecode(token)`), enquanto a API retorna `{ token: "..." }`. O código atual ignora isso — `jwtDecode` falha silenciosamente pois não usa o token.

#### Tela: Cadastro de Gêneros (`/generos`)
**Arquivo:** [`pages/CadastroGenero/CadastroGenero.jsx`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/Projeto_Veiculo/Filme/src/pages/CadastroGenero/CadastroGenero.jsx)

- Protegida por `PrivateRoute`
- CRUD completo: listar, cadastrar, editar inline, excluir com confirmação
- Usa componentes genéricos: `<Cadastro>`, `<Lista>`, `<Header>`, `<Footer>`
- Exibe coluna "Gênero" oculta na tabela (para uniformidade com o componente Lista genérico)

#### Tela: Cadastro de Filmes (`/filmes`)
**Arquivo:** [`pages/CadastroFilme/CadastroFilme.jsx`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/Projeto_Veiculo/Filme/src/pages/CadastroFilme/CadastroFilme.jsx)

- Protegida por `PrivateRoute`
- CRUD completo com upload de imagem via `multipart/form-data`
- Ao carregar, busca gêneros E filmes em paralelo
- Mapeia `idGenero` do filme para exibir o nome do gênero na tabela
- Exibe miniatura da imagem (40x40px) usando `apiHost/imagens/{nomeArquivo}`

### 4.3 Componentes Existentes

| Componente | Arquivo | Função |
|---|---|---|
| `Header` | `components/header/Header.jsx` | Cabeçalho com logo e links de navegação (Filme / Gênero) |
| `Footer` | `components/footer/Footer.jsx` | Rodapé com copyright |
| `Cadastro` | `components/cadastro/Cadastro.jsx` | Formulário genérico configurável por props |
| `Lista` | `components/lista/Lista.jsx` | Tabela genérica com colunas configuráveis por props |
| `Botao` | `components/botao/Botao.jsx` | Botão genérico (submit ou cancelar) |
| `Alerta` | `components/alerta/Alerta.jsx` | Wrapper do SweetAlert2 |
| `PrivateRoute` | `components/routes/PrivateRoute.jsx` | HOC de proteção de rotas |

### 4.4 Formulários Existentes

| Formulário | Campos | Endpoint chamado |
|---|---|---|
| Login | email, senha | `POST /api/Login` |
| Cadastro de Gênero | nome | `POST /api/generos` |
| Edição de Gênero | nome | `PUT /api/generos/{id}` |
| Cadastro de Filme | titulo, idGenero (select), imagem (file) | `POST /api/filmes` |
| Edição de Filme | titulo, idGenero (select), imagem (file) | `PUT /api/filmes/{id}` |

### 4.5 Integração com a API

**Arquivo de configuração:** [`services/Services.js`](file:///c:/Users/54534361823/Desktop/Projeto_Veiculo/Projeto_Veiculo/Filme/src/services/Services.js)

```javascript
const localApi = `http://localhost:5182/api`
const api = axios.create({ baseURL: localApi })
export const apiHost = `http://localhost:5182`  // para imagens estáticas
```

**Mapa de chamadas API por página:**

```
Login.jsx
  └── POST /api/Login

CadastroGenero.jsx
  ├── GET    /api/generos
  ├── POST   /api/generos
  ├── PUT    /api/generos/{id}
  └── DELETE /api/generos/{id}

CadastroFilme.jsx
  ├── GET    /api/generos     (para popular select)
  ├── GET    /api/filmes
  ├── POST   /api/filmes      (multipart/form-data)
  ├── PUT    /api/filmes/{id} (multipart/form-data)
  └── DELETE /api/filmes/{id}
```

### 4.6 Gerenciamento de Estado

**Context API:** `UsuarioContext` + `UsuarioProvider`

- Estado `usuario` persiste no `localStorage`
- Expõe: `usuario`, `setUsuario`, `sair()`
- `PrivateRoute` lê `usuario` do contexto para decidir redirecionar

### 4.7 Roteamento

| Rota | Componente | Protegida? |
|---|---|---|
| `/` | `Login` | Não |
| `/generos` | `CadastroGenero` | Sim (PrivateRoute) |
| `/filmes` | `CadastroFilme` | Sim (PrivateRoute) |

---

## 5. PLANO DE ADAPTAÇÃO

> Este plano transforma o sistema de **Filmes + Gêneros** em um sistema de **Veículos + Categorias** (ou similar), mantendo a arquitetura idêntica.

### 5.1 O que REMOVER

| Item | Arquivo | Motivo |
|---|---|---|
| Tabela `Filme` | `DDL_Filmes.sql` | Substituída pela entidade do novo domínio |
| Tabela `Genero` | `DDL_Filmes.sql` | Substituída pela categoria do novo domínio |
| Model `Filme.cs` | `Models/Filme.cs` | Substituído pelo model do novo domínio |
| Model `Genero.cs` | `Models/Genero.cs` | Substituído pelo model da nova categoria |
| `FilmeDTO.cs` | `DTO/FilmeDTO.cs` | Substituído pelo DTO do novo domínio |
| `FilmeContext.cs` (parcial) | `BdContextFilme/FilmeContext.cs` | DbSets e mapeamentos renomeados |
| `FilmeController.cs` | `Controllers/FilmeController.cs` | Substituído pelo controller do novo domínio |
| `GeneroController.cs` | `Controllers/GeneroController.cs` | Substituído pelo controller da nova categoria |
| `FilmeRepository.cs` | `Repository/FilmeRepository.cs` | Substituído pelo repositório do novo domínio |
| `GeneroRepository.cs` | `Repository/GeneroRepository.cs` | Substituído pelo repositório da nova categoria |
| `IFilmeRepository.cs` | `Interfaces/IFilmeRepository.cs` | Substituído pela interface do novo domínio |
| `IGeneroRepository.cs` | `Interfaces/IGeneroRepository.cs` | Substituído pela interface da nova categoria |
| Pasta `wwwroot/imagens/` | Back-end | Renomear se a nova entidade ainda usar imagens |
| Página `CadastroFilme/` | `pages/CadastroFilme/` | Substituída pela página do novo domínio |
| Página `CadastroGenero/` | `pages/CadastroGenero/` | Substituída pela página da nova categoria |
| `NovaPasta/` | Back-end | Já ignorada; pode ser deletada |

### 5.2 O que REAPROVEITAR (sem alteração)

| Item | Arquivo | Motivo |
|---|---|---|
| Model `Usuario.cs` | `Models/Usuario.cs` | Autenticação não muda |
| `LoginController.cs` | `Controllers/LoginController.cs` | Fluxo JWT idêntico |
| `UsuarioController.cs` | `Controllers/UsuarioController.cs` | Cadastro de usuário idêntico |
| `IUsuarioRepository.cs` | `Interfaces/IUsuarioRepository.cs` | Contrato idêntico |
| `UsuarioRepository.cs` | `Repository/UsuarioRepository.cs` | Lógica idêntica (apenas implementar `BuscarPorId`) |
| `LoginDTO.cs` | `DTO/LoginDTO.cs` | DTO idêntico |
| `Criptografia.cs` | `Utils/Criptografia.cs` | Helper genérico; inalterado |
| `appsettings.json` | Back-end | Apenas renomear connection string |
| `Program.cs` | Back-end | Estrutura idêntica; apenas trocar nomes de DI |
| `Header.jsx` | `components/header/` | Apenas atualizar textos dos links |
| `Footer.jsx` | `components/footer/` | Apenas atualizar texto do copyright |
| `Cadastro.jsx` | `components/cadastro/` | Componente genérico; inalterado |
| `Lista.jsx` | `components/lista/` | Componente genérico; inalterado |
| `Botao.jsx` | `components/botao/` | Componente genérico; inalterado |
| `Alerta.jsx` | `components/alerta/` | Wrapper genérico; inalterado |
| `PrivateRoute.jsx` | `components/routes/` | Lógica de autenticação idêntica |
| `UsuarioContext.jsx` | `context/` | Context genérico; inalterado |
| `UsuarioProvider.jsx` | `context/` | Lógica de autenticação idêntica |
| `Services.js` | `services/` | Apenas atualizar a porta se necessário |
| `routes.jsx` | `Routes/` | Estrutura idêntica; apenas trocar paths e components |
| `Login.jsx` + `Login.css` | `pages/Login/` | Página idêntica; apenas trocar textos e logo |
| CSS de todos os componentes genéricos | Vários | Reaproveitados sem alteração |
| `package.json` | Front-end | Dependências já corretas |
| `.csproj` | Back-end | Pacotes NuGet já corretos |

### 5.3 O que CRIAR

| Item | Arquivo sugerido | Descrição |
|---|---|---|
| Tabela `Veiculo` | `DDL_Veiculo.sql` | Nova tabela com campos do domínio veículo |
| Tabela `Categoria` | `DDL_Veiculo.sql` | Substitui `Genero` (ex: SUV, Sedan, Pickup) |
| Model `Veiculo.cs` | `Models/Veiculo.cs` | Entidade com campos do novo domínio |
| Model `Categoria.cs` | `Models/Categoria.cs` | Entidade categoria/tipo do veículo |
| `VeiculoDTO.cs` | `DTO/VeiculoDTO.cs` | DTO para criação/edição de veículo |
| `IVeiculoRepository.cs` | `Interfaces/IVeiculoRepository.cs` | Contrato do repositório de Veículo |
| `ICategoriaRepository.cs` | `Interfaces/ICategoriaRepository.cs` | Contrato do repositório de Categoria |
| `VeiculoRepository.cs` | `Repository/VeiculoRepository.cs` | Implementação do repositório |
| `CategoriaRepository.cs` | `Repository/CategoriaRepository.cs` | Implementação do repositório |
| `VeiculoController.cs` | `Controllers/VeiculoController.cs` | Endpoints CRUD de veículo |
| `CategoriaController.cs` | `Controllers/CategoriaController.cs` | Endpoints CRUD de categoria |
| `VeiculoContext.cs` | `BdContextVeiculo/VeiculoContext.cs` | DbContext atualizado |
| Página `CadastroVeiculo/` | `pages/CadastroVeiculo/` | Página CRUD de veículos |
| Página `CadastroCategoria/` | `pages/CadastroCategoria/` | Página CRUD de categorias |
| Logo e assets | `assets/img/` | Novos assets visuais para o domínio veículo |

---

## 6. CHECKLIST DE ALTERAÇÕES

### 6.1 ✅ Banco de Dados

- [ ] Criar novo arquivo `DDL_Veiculo.sql`
- [ ] Definir e criar banco de dados `VeiculoBD`
- [ ] Criar tabela `Categoria` (substitui `Genero`)
- [ ] Criar tabela `Veiculo` (substitui `Filme`) com campos do novo domínio
- [ ] Manter tabela `Usuario` exatamente como está
- [ ] Definir FK de `Veiculo → Categoria`
- [ ] Decidir se o campo `Imagem` ainda existe no novo domínio (foto do veículo)

### 6.2 ✅ API (Back-End)

**Configuração**
- [ ] Renomear connection string em `appsettings.json` → `VeiculoBD`
- [ ] Renomear namespace do projeto de `FilmesMoura.WebAPI` para `Veiculo.WebAPI` (ou equivalente)
- [ ] Atualizar `Program.cs`: trocar registros DI de Filme/Genero por Veiculo/Categoria
- [ ] Atualizar Swagger: alterar título de "Filmes API" para "Veículos API"
- [ ] Atualizar chave JWT (opcional, mas recomendado)

**DbContext**
- [ ] Renomear `FilmeContext.cs` → `VeiculoContext.cs`
- [ ] Atualizar `DbSet<Filme>` → `DbSet<Veiculo>`
- [ ] Atualizar `DbSet<Genero>` → `DbSet<Categoria>`
- [ ] Manter `DbSet<Usuario>` sem alteração

**Models**
- [ ] Remover `Filme.cs`
- [ ] Remover `Genero.cs`
- [ ] Criar `Veiculo.cs` com atributos do novo domínio (ex: Marca, Modelo, Ano, Cor, Placa, Categoria)
- [ ] Criar `Categoria.cs` com `IdCategoria` e `Nome`
- [ ] Manter `Usuario.cs` sem alteração

**DTOs**
- [ ] Remover `FilmeDTO.cs`
- [ ] Criar `VeiculoDTO.cs` (se precisar de upload de imagem, manter `IFormFile`; senão, usar JSON simples)
- [ ] Manter `LoginDTO.cs` sem alteração

**Interfaces**
- [ ] Remover `IFilmeRepository.cs`
- [ ] Remover `IGeneroRepository.cs`
- [ ] Criar `IVeiculoRepository.cs` com os mesmos métodos de `IFilmeRepository`
- [ ] Criar `ICategoriaRepository.cs` com os mesmos métodos de `IGeneroRepository`
- [ ] Manter `IUsuarioRepository.cs` sem alteração (implementar `BuscarPorId`)

**Repositories**
- [ ] Remover `FilmeRepository.cs`
- [ ] Remover `GeneroRepository.cs`
- [ ] Criar `VeiculoRepository.cs` implementando `IVeiculoRepository`
- [ ] Criar `CategoriaRepository.cs` implementando `ICategoriaRepository`
- [ ] Manter `UsuarioRepository.cs`; implementar `BuscarPorId`

**Controllers**
- [ ] Remover `FilmeController.cs`
- [ ] Remover `GeneroController.cs`
- [ ] Criar `VeiculoController.cs` com rota `api/veiculos`
- [ ] Criar `CategoriaController.cs` com rota `api/categorias`
- [ ] Manter `LoginController.cs` sem alteração
- [ ] Manter `UsuarioController.cs` sem alteração

### 6.3 ✅ Front-End

**Configuração**
- [ ] Renomear o projeto (`package.json`: name de `"filme"` para `"veiculo"`)
- [ ] Verificar porta em `Services.js` (confirmar que a API ainda roda na 5182)

**Rotas**
- [ ] Atualizar `Routes/routes.jsx`: trocar `/filmes` → `/veiculos` e `/generos` → `/categorias`
- [ ] Atualizar componentes importados nas rotas

**Páginas**
- [ ] Remover `pages/CadastroFilme/`
- [ ] Remover `pages/CadastroGenero/`
- [ ] Criar `pages/CadastroVeiculo/CadastroVeiculo.jsx` (baseado em `CadastroFilme.jsx`)
- [ ] Criar `pages/CadastroCategoria/CadastroCategoria.jsx` (baseado em `CadastroGenero.jsx`)
- [ ] Criar CSS correspondente para cada página nova
- [ ] Atualizar `pages/Login/Login.jsx`: corrigir navegação pós-login (trocar `/generos` → `/categorias`)
- [ ] Corrigir **bug do token**: `Login.jsx` faz `jwtDecode(retornoAPI.data)` mas deve fazer `jwtDecode(retornoAPI.data.token)`

**Componentes Genéricos (atualizar textos)**
- [ ] `Header.jsx`: trocar links "Filme" → "Veículo" e "Gênero" → "Categoria"
- [ ] `Footer.jsx`: trocar "Projeto Filmes SENAI" → "Projeto Veículos SENAI"

**Componentes Genéricos (sem alteração de lógica)**
- [ ] `Cadastro.jsx` — manter como está
- [ ] `Lista.jsx` — avaliar se precisa de coluna adicional (ex: Placa, Ano)
- [ ] `Botao.jsx` — manter como está
- [ ] `Alerta.jsx` — manter como está
- [ ] `PrivateRoute.jsx` — manter como está

**Assets**
- [ ] Substituir `logo.svg` por logo do novo domínio
- [ ] Substituir `fundoLogin.png` por imagem temática de veículos

### 6.4 ✅ Documentação

- [ ] Atualizar `README.md` do projeto
- [ ] Criar/atualizar `DDL_Veiculo.sql` com comentários explicativos
- [ ] Atualizar título do Swagger (`Program.cs`)
- [ ] Documentar novos campos do modelo Veículo

---

## 7. RISCOS

### 🔴 Risco Alto

| Risco | Descrição | Mitigação |
|---|---|---|
| **Perda de dados em produção** | Se o banco `FilmesBD_Moura` contiver dados reais, a criação de um novo banco pode causar perda | Fazer backup completo do banco antes de qualquer alteração |
| **Quebra de namespace** | Renomear o namespace do projeto em massa pode causar erros de compilação em todos os arquivos | Usar "Rename Symbol" da IDE (Visual Studio) em vez de busca manual |
| **Bug do Token JWT no Front-End** | `Login.jsx` faz `jwtDecode(retornoAPI.data)` em vez de `jwtDecode(retornoAPI.data.token)` — isso já está incorreto e causará erro ao adaptar | Corrigir antes de qualquer outra mudança no `Login.jsx` |

### 🟡 Risco Médio

| Risco | Descrição | Mitigação |
|---|---|---|
| **FK com restrição de integridade** | Deletar um `Genero/Categoria` que tenha `Filme/Veiculo` associado causará erro de FK | Implementar validação no repositório antes de deletar, ou configurar `ON DELETE CASCADE` |
| **Imagens órfãs** | Se um veículo for deletado sem remover o arquivo físico, imagens ficam acumuladas em `wwwroot/imagens/` | `FilmeController` já faz a remoção corretamente; replicar esse padrão |
| **`BuscarPorId` não implementado** | `UsuarioRepository.BuscarPorId()` lança `NotImplementedException`. Se alguma funcionalidade nova precisar disso, causará erro em runtime | Implementar antes de usar |
| **`GeneroRepository.Listar()` com dupla query** | Bug de lógica — faz dois `ToList()` desnecessariamente | Corrigir ao criar `CategoriaRepository` |
| **Coluna `Imagem` na tabela Veiculo** | Definir se veículos terão foto impacta o DTO, o controller e o front-end | Decidir antes de começar o desenvolvimento |

### 🟢 Risco Baixo

| Risco | Descrição | Mitigação |
|---|---|---|
| **Token JWT expira em 5 minutos** | A expiração curta pode causar deslogamento frequente | Aumentar `expires: DateTime.Now.AddMinutes(5)` para tempo adequado |
| **Chave JWT no código-fonte** | A chave `"filmes-chave-autenticacao-webapi-dev"` está hardcoded | Mover para `appsettings.json` → seção `Jwt:Key` |
| **CORS AllowAll** | Aceita qualquer origem — seguro apenas em desenvolvimento | Restringir para origem do front-end em produção |
| **`db.json` no front-end** | Arquivo de mock vazio; não impacta a API real | Pode ser removido ou atualizado |
| **`NovaPasta/` ignorada** | Pasta existe no projeto mas é explicitamente excluída do build | Limpar para não confundir desenvolvedores |

---

## 8. PLANO DE IMPLEMENTAÇÃO (PASSO A PASSO)

> Execute as etapas na ordem indicada para minimizar riscos de quebra.

### FASE 1 — Preparação (Sem tocar no código)
1. Criar uma branch git separada: `git checkout -b feature/adaptacao-veiculo`
2. Fazer backup do banco `FilmesBD_Moura` (se tiver dados)
3. Documentar quais campos o modelo `Veiculo` terá (com a equipe)
4. Definir se `Veiculo` terá campo de imagem

### FASE 2 — Banco de Dados
5. Criar o arquivo `DDL_Veiculo.sql` com as novas tabelas (`Categoria`, `Veiculo`, `Usuario`)
6. Executar o script em um banco novo `VeiculoBD`
7. Testar a conexão e verificar as tabelas criadas

### FASE 3 — Back-End (API)
8. Atualizar `appsettings.json`: renomear connection string para `VeiculoBD`
9. Criar `Models/Categoria.cs` e `Models/Veiculo.cs`
10. Criar `BdContextVeiculo/VeiculoContext.cs` (baseado em `FilmeContext.cs`)
11. Criar `DTO/VeiculoDTO.cs`
12. Criar `Interfaces/ICategoriaRepository.cs` e `Interfaces/IVeiculoRepository.cs`
13. Criar `Repository/CategoriaRepository.cs` e `Repository/VeiculoRepository.cs`
14. Criar `Controllers/CategoriaController.cs` e `Controllers/VeiculoController.cs`
15. Atualizar `Program.cs`: registrar novo contexto e novos repositórios via DI
16. Compilar e testar no Swagger — verificar todos os endpoints

### FASE 4 — Front-End
17. Atualizar `services/Services.js` se a porta mudar
18. Corrigir bug do token em `Login.jsx` (linha `jwtDecode`)
19. Atualizar `Login.jsx`: trocar redirect de `/generos` para `/categorias`
20. Criar `pages/CadastroCategoria/CadastroCategoria.jsx` (baseado em `CadastroGenero.jsx`)
21. Criar `pages/CadastroVeiculo/CadastroVeiculo.jsx` (baseado em `CadastroFilme.jsx`)
22. Atualizar `Routes/routes.jsx`: novas rotas `/categorias` e `/veiculos`
23. Atualizar `Header.jsx`: novos links de navegação
24. Atualizar `Footer.jsx`: novo texto do copyright
25. Substituir assets (logo, fundo de login)
26. Testar fluxo completo: login → categorias → veículos

### FASE 5 — Limpeza e Validação
27. Remover arquivos antigos: `Filme.cs`, `Genero.cs`, `FilmeDTO.cs`, controllers/repositories/interfaces de Filme e Gênero
28. Remover páginas antigas do front-end: `CadastroFilme/`, `CadastroGenero/`
29. Deletar `NovaPasta/` do back-end
30. Testar todos os fluxos de ponta a ponta
31. Revisar o `README.md`
32. Fazer merge na branch principal

---

> **Conclusão:** O projeto possui uma arquitetura sólida e bem organizada (Repository Pattern + DI + Context API no front-end), o que facilita imensamente a adaptação. Estima-se que **~70% do código pode ser reaproveitado diretamente**, com alterações sendo principalmente renomeações e ajustes de domínio. Os dois pontos que precisam de atenção imediata antes de qualquer trabalho são: o **bug do token JWT no Login.jsx** e a definição dos **campos do modelo Veículo**.
