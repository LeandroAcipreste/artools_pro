# Documentação Técnica - Artools Pro (FirstSite)

## 1. Visão Geral
Este projeto é uma landing page (Single Page Application) focada na venda e apresentação da "Artools Precision Pen". O site tem como objetivo principal oferecer uma experiência visual imersiva e responsiva (Mobile e Web), com animações fluídas focadas em UX/UI moderna e design inspirado no "bento box" (em grade).

## 2. Tecnologias Utilizadas
- **HTML5 & CSS3 Vanilla**: Estruturação semântica e customizações finas de layout, efeitos de tipografia e elementos fixos (ex: marquee, interfaces blur/glassmorphism, animações contínuas, e scroll container fixo).
- **Tailwind CSS (via CDN)**: Framework utility-first utilizado para acelerar drasticamente a estilização responsiva, espaçamentos, tipografia fluída e cores pré-definidas através de classes CSS inline.
- **EcmaScript Modules (ESM) / Vanilla JS**: Toda a arquitetura do projeto utiliza JavaScript puro moderno, modularizado nativamente por meio de ES Modules, sem haver a necessidade de bundlers (Webpack, Vite) ou frameworks frontend (como React ou Vue).
- **GSAP (GreenSock) & ScrollTrigger**: Essencial no projeto. Utilizado para criar interações complexas baseadas em progressão de scroll (animações de revelação, scrub tracking no frame rendering do componente Hero, etc).
- **Three.js**: Biblioteca WebGL usada na seção 4 (Sphere Section) para renderizar a esfera tridimensional interativa em tempo-real via canvas, usando customizações matemáticas de Particles (Shaders) controlados via coordenação de mouse/tempo.
- **Lenis Smooth Scroll**: Biblioteca focada em suavidade, implementada globalmente para sobrescrever o scroll nativo dos navegadores, dando características lineares de inércia à rolagem da página.
- **Iconify**: Integração nativa de web components usada para renderizar e estilizar via CDN milhares de ícones vetoriais de várias bibliotecas (Solar, devicons, etc) centralizando as requisições facilmente pela tag `<iconify-icon>`.

## 3. Arquitetura de Pastas JavaScript (`/firstSite/js`)

Toda a lógica imperativa do site foi dividida para melhorar drasticamente a legibilidade e fácil manutenção.

* **`main.js`**: É o "coração" (Entry Point) da SPA. Único arquivo invocado no HTML. Ele se encarrega de importar e orquestrar todas os módulos filhos (Core, Utils e Modules) ao mesmo tempo que injeta bibliotecas terceiras no ecossistema (Preloader inicial, Lenis, GSAP base).
* **`core/`**
  * **`scroll.js`**: Gerencia a configuração, requadro base (requestAnimationFrame) e setup da instância do `Lenis` (responsável pelo layout deslizado do scroll).
* **`utils/`**
  * **`formatters.js`**: Reúne métodos vitais para os inputs de usuário. Cuida das máscaras de validação e regex (ex: máscara de auto-formatação linear para Inputs de CPF, Data, Telefone celular, CEP, além de formatadores de moeda).
* **`modules/`** *(Os scripts fracionados de componentes específicos do DOM)*
  * **`preloader.js`**: Comanda a lógica e timer da tela em tela-cheia (vídeo e contagem progressiva overlay de 0 a 100).
  * **`header.js` & `navigation.js`**: Cuidam da transparência do cabeçalho no scroll e das interceptações dos cliques nas âncoras locais do site (suavizando a descida pelo header até o elemento alvo).
  * **`hero.js`**: Interação nativa principal que injeta quadros/imagens (frame sequence JPEG/WebP) renderizados consecutivamente num objeto genérico de Canvas pareado diretamente com o percurso (ScrollTrigger Scrub), garantindo a sensação 3D ultra suave do produto principal.
  * **`bento-cards.js` & `visual-grid.js`**: Manipulam a injeção linear de divs absolutas de movimento ("Cobrinhas" que traçam linhas nos layouts). Acoplada com as animações de relevo (reveal) dos componentes gráficos do Bento Box (Especificações Técnicas).
  * **`sphere-3d.js` & `sphere-card.js`**: Tratam logicamente as instâncias nativas da scene object, mesh geometry material, vertex e fragment shaders (GLSL paramétrico) do ThreeJS na renderização tridimensional interativa de background.
  * **`neon-footer.js`**: Controla o SVG vivo no rodapé da página. Pinta o layout dinâmico baseado no stroke path via javascript puro somado às manipulações de dom do DOM e animações cíclicas de GSAP de luzes.
  * **`checkout.js`**: O maestro do comércio eletrônico central (Single View). Escuta as chamadas ao carrinho, controla o DOM virtual de Inputs para adicionar e reduzir unidades das canetas. Cuida também de toda a rotina macro do envio do Formulário de Checkout (simulado client-side).
  * **`back-to-top.js`**: Observer direcional leve para reverter a locomoção do scroll no botão inferior direito transparente.

## 4. O Fluxo de Compra e Manipulação de Checkout (Front-End)

Todo o carrinho do sistema transcorre por uma rota fluida lateral (Drawer/Panel Modal Sideview) que barra recarregar a tela, focando numa ultra conversão sem distrações para o cliente final. O ecossistema roda nestas ordens lógicas base (`checkout.js`):

1. **Abertura do Overlay do Carrinho**: O usuário clica na bolsa na NavBar (`header`) ou diretamente pelo botão animado na Sphere-Section (**"Adicionar à sacola"**).
2. **Exibição do Componente de Formulário**: Uma side element intercepta a view nativa renderizando um super-formulário estruturado em três domínios e com labels de Total:
    - Informações Pessoais (Nome, Email, CPF em tempo real);
    - Endereço de Entrega (CEP mascarado direto);
    - Setor de Gateway Transparente de Pagamento Simulado (Cartão, CVV, Validade).
3. **Engrenagem Condicional Numerária**: Possuímos componentes ativos nativos de `+` ou `-` de unidades. O clique atualiza o dataset do valor (inicializado com Preço-Alvo Base: R$ 299). O Vanilla JS faz formatação de moeda brasileira dinâmica a cada trigger trocando do multiplicador em todo o HTML element-span `#checkout-total`.
4. **Trigger de Envio (Simulator)**: Acionamos por um Form native "Submiter". Quando clicado, e com apoio vital das tags de validação `required` do form que barram envios mal formatados ou rasos, invocamos um `event.preventDefault()` que desativa redirecionamentos bruscos de action nativas.
5. **A Confirmação Visual Elegante**: Substituindo loaders genéricos, o EventListener manipula o painel de classe removendo `opacity-100` e ativando `pointer-events-none` na seção 1 do form, ao qual dá revelação transicional à aba state-2 (Success-Screen). O cliente final obtém por simulação de tela a notificação garantida que o produto está alocado para entrega.
