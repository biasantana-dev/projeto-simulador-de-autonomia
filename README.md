# 🔋 Simulador de Autonomia de Bateria

Um simulador interativo desenvolvido para calcular o impacto de diferentes recursos do sistema (como Wi-Fi, Modo Jogo e Brilho de Tela) na autonomia de uma bateria de 5000mAh.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído do zero, aplicando os seguintes conceitos e tecnologias:
- **HTML5 Semântico:** Estrutura limpa da aplicação.
- **CSS3 / Flexbox & Responsividade:** Metodologia *Mobile First* com adaptação para telas maiores via `@media queries`.
- **JavaScript (ES6):** Manipulação do DOM, tratamento de eventos (`change`, `input`), escopo, objetos de configuração e cálculos matemáticos condicionais.
- **FontAwesome:** Ícones vetoriais modernos.

## 📱 Funcionalidades

- **Cálculo em Tempo Real:** A porcentagem da bateria e o tempo estimado de autonomia diminuem instantaneamente conforme o usuário interage com os controles.
- **Feedback Visual Dinâmico:** A barra de progresso da bateria altera sua largura e cor de forma fluida conforme o consumo aumenta.
- **Design Responsivo:** Layout otimizado para celulares e adaptado para visualização em desktops.

## 💡 O que aprendi / Desafios Superados

- Sincronização em tempo real entre inputs do usuário (`checkbox` e `range`) e variáveis de estado no JavaScript.
- Organização da ordem de execução lógica (garantindo que os cálculos de matemática aconteçam *após* a aplicação dos descontos de consumo).
- Aplicação de boas práticas de estilização focadas em UX/UI moderna para dispositivos móveis.
