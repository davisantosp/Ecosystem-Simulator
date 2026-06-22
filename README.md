# EcoSim - Simulador de Ecossistema Dinâmico

O **EcoSim** é um motor de simulação de ecossistema multiespécie desenvolvido em TypeScript e Node.js. O projeto foca-se na aplicação prática de conceitos avançados de Programação Orientada a Objetos (POO), arquitetura desacoplada e Inteligência Artificial baseada em utilidade (*Utility AI*) para ditar o comportamento e a sobrevivência de entidades vivas (animais e plantas) num ambiente dinâmico baseado em turnos (*ticks*).

Este projeto foi desenvolvido com um foco rigoroso em boas práticas de engenharia de software, servindo como demonstração de competências em design de arquitetura backend para portefólio profissional.

---

## Características Principais

- **Motor de Simulação Baseado em Ticks:** Loop de execução discreto onde o tempo avança por ciclos (*ticks*), atualizando o estado global do mundo e de cada entidade de forma isolada.
- **Utility AI (Tomada de Decisão Dinâmica):** Os animais não seguem caminhos estáticos. Cada entidade calcula dinamicamente a sua maior urgência a cada segundo (Fome, Sede, Necessidade de Reprodução) através de uma fórmula matemática ponderada por pesos (*utility score*).
- **Movimentação Geométrica Inteligente:** Sistema de visão (*Vision System*) acoplado que permite às entidades rastrearem alvos comestíveis, parceiros ou água dentro de um raio bidimensional $(x, y)$, aplicando algoritmos de aproximação.
- **Ambiente Blindado com Testes:** Suite de testes unitários automatizados integrados para garantir a integridade dos sistemas e evitar regressões durante a escalabilidade do projeto.

---

## Arquitetura e Design Patterns

O projeto foi desenhado para ser extensível e de fácil manutenção, aplicando padrões de desenho consagrados no mercado:

- **Strategy Pattern (Padrão Estratégia):** Utilizado no sistema de movimentação (`MovementSystem`). Os comportamentos como `RandomlyMove` ou `SearchFood` são classes concretas que implementam uma interface comum, permitindo que a IA altere a estratégia de movimento do animal em tempo de execução sem acoplamento rígido.
- **Factory Pattern (Padrão Fábrica):** Implementado tanto para a infraestrutura do ecossistema quanto para o ambiente de testes (`AnimalFactory`, `PlantFactory`, `CoreFactory`). Permite a criação centralizada de entidades com estados customizados ou estados padrão (*default states*) previsíveis.
- **Herança e Polimorfismo:** Classes abstratas robustas para entidades vivas, permitindo que o ecossistema trate de forma genérica interações complexas entre diferentes espécies (como Lobos, Coelhos e Alces) e tipos de dietas (Carnívoros e Herbívoros).

---

## Estrutura do Projeto

```text
├── src/
│   ├── core/                  # Motores principais (Engine, World)
│   ├── domain/                # Domínio do negócio (Entities, Enums)
│   │   ├── entities/          # LivingEntity, Animal, Plant
│   │   └── enums/             # Estados, Espécies, Ações, Dietas
│   ├── shared/                # Tipagens comuns e estruturas geométricas
│   └── systems/               # Sistemas de lógica pura (Movement, Vision, Functions)
└── tests/                     # Suite de Testes Unitários isolada da produção
    ├── factories/             # Fábricas de objetos para suporte aos testes
    └── systems/               # Testes de integração e unitários dos sistemas