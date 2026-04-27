<template>
  <!-- Botão fixo para iniciar tutorial -->
  <button
    @click="startTutorial"
    class="fixed bottom-16 right-6 bg-[#1a4a8a] text-white p-3 rounded-full shadow-md hover:bg-[#0c447c] transition-colors z-50 sm:bottom-20 sm:right-8 md:p-4"
    title="Iniciar Tutorial"
  >
    <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </button>
</template>

<script setup>
import { nextTick } from 'vue';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

let driverObj = null;
let currentStepIndex = 0;

// Função para abrir accordion e aguardar
const openAccordionAndWait = async (index) => {
  await nextTick();

  const accordionButton = document.querySelector(`#tutorial-matricula-${index}`);

  if (!accordionButton) {
    console.warn(`Botão do accordion #tutorial-matricula-${index} não encontrado`);
    return false;
  }

  const buttonParent = accordionButton.closest('.bg-white');
  const panel = buttonParent?.querySelector('[data-headlessui-state]');
  const isOpen = panel?.getAttribute('data-headlessui-state')?.includes('open');

  if (!isOpen) {
    accordionButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await nextTick();
  }

  return true;
};

// Aguarda o conteúdo do accordion carregar
const waitForAccordionContent = async () => {
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 300));

  const personalData = document.querySelector('.p-5:has(.text-\\[11px\\]) .grid');
  if (!personalData) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

// Criação da instância do driver
const createDriver = () => {
  return driver({
    popoverClass: 'custom-tooltip-centered',
    showProgress: true,
    showButtons: ["next", "previous", "close"],
    nextBtnText: "Próximo",
    prevBtnText: "Anterior",
    doneBtnText: "Concluir",
    closeBtnText: "Fechar",
    progressText: "{{current}} de {{total}}",
    overlayColor: "rgba(0, 0, 0, 0.65)",
    allowClose: false,

    onStepChanged: (step) => {
      currentStepIndex = step.index;
    },
    steps: [
      // Passo 1 - Boas vindas
      {
        popover: {
          title: '<div class="tutorial-title">👋 Bem-vindo ao Painel da Gratificação</div>',
          description: '<div class="tutorial-description">Este tutorial vai te ajudar a entender todas as informações importantes sobre sua gratificação.<br><br><strong>⚠️ Após o tutorial, verifique seus dados com atenção!</strong></div>',
          position: "center",
        },
      },

      // Passo 2 - Nome do servidor
      {
        element: () => document.querySelector('.grid-cols-1.sm\\:grid-cols-2 > div:first-child'),
        popover: {
          title: '<div class="tutorial-title">👤 Nome do Servidor</div>',
          description: '<div class="tutorial-description">Este é o nome do servidor ao qual as informações exibidas no painel pertencem.</div>',
          position: "bottom",
        },
      },

      // Passo 3 - Valor total
      {
        element: () => document.querySelector('.grid-cols-1.sm\\:grid-cols-2 > div:last-child'),
        popover: {
          title: '<div class="tutorial-title">💰 Valor Total a Receber</div>',
          description: '<div class="tutorial-description">Aqui você visualiza o valor bruto da sua gratificação, somando todos os seus vínculos.<br><br><strong>Este valor ainda não considera descontos de impostos.</strong></div>',
          position: "bottom",
        },
      },

      // Passo 4 - Aviso de impostos
      {
        element: () => document.querySelector('.bg-red-50'),
        popover: {
          title: '<div class="tutorial-title">⚠️ Aviso Importante</div>',
          description: '<div class="tutorial-description">Os valores mostrados são <strong>brutos</strong>, sem os descontos de impostos que podem ser aplicados no contracheque.</div>',
          position: "top",
        },
      },

      // Passo 5 - Ilustração de dúvidas
      {
        element: () => document.querySelector('.bg-\\[\\#f0f6ff\\]'),
        popover: {
          title: '<div class="tutorial-title">❓ Dúvidas sobre os valores?</div>',
          description: '<div class="tutorial-description">Se ficar com alguma dúvida, consulte o detalhamento abaixo para entender como o valor foi calculado.</div>',
          position: "top",
        },
      },

      // Passo 6 - Seção de matrículas
      {
        element: () => document.querySelector('.px-6.pt-6 > p:first-child'),
        popover: {
          title: '<div class="tutorial-title">📋 Matrículas</div>',
          description: '<div class="tutorial-description">Aqui estão listadas todas as suas matrículas ativas durante o ano de competência.<br><br><strong>Clique em cada uma para expandir os detalhes!</strong></div>',
          position: "bottom",
        },
        onNext: async () => {
          await openAccordionAndWait(0);
        },
      },

      // Passo 7 - Matrícula expandida (cabeçalho)
      {
        element: () => {
          const openAccordion = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          return openAccordion || document.querySelector('#tutorial-matricula-0');
        },
        popover: {
          title: '<div class="tutorial-title">📌 Matrícula Expandida</div>',
          description: '<div class="tutorial-description">Agora você vê os detalhes completos desta matrícula, incluindo dados pessoais, valores e critérios de avaliação.</div>',
          position: "top",
        },
        onHighlightStarted: async () => {
          await openAccordionAndWait(0);
          await waitForAccordionContent();
        },
      },

      // Passo 8 - Dados pessoais
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('.grid-cols-1.sm\\:grid-cols-4');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">📋 Dados Pessoais</div>',
          description: '<div class="tutorial-description">Verifique se seus dados cadastrais estão corretos: nome, CPF, matrícula e cargo.</div>',
          position: "top",
        },
      },

      // Passo 9 - Valor máximo rede
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-valor-rede');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">🏫 Valor Máximo - Rede</div>',
          description: '<div class="tutorial-description">Este é o <strong>valor máximo</strong> que você <strong>pode receber</strong> pelo resultado da rede como um todo.</div>',
          position: "top",
        },
      },

      // Passo 10 - Valor máximo unidades
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-valor-unidade');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">🏢 Valor Máximo - Unidades</div>',
          description: '<div class="tutorial-description">Este é o <strong>valor máximo</strong> que você <strong>pode receber</strong> pelo resultado das unidades e etapas em que atuou.</div>',
          position: "top",
        },
      },

      // Passo 11 - Desconto
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-desconto');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">📉 Desconto Aplicado</div>',
          description: '<div class="tutorial-description">Valor descontado caso você <strong>não tenha atingido 100%</strong> do critério individual de frequência.</div>',
          position: "top",
        },
      },

      // Passo 12 - Total a receber
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-valor-total');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">✅ Total a Receber</div>',
          description: '<div class="tutorial-description"><strong>Este é o valor final</strong> que você tem direito a receber nesta matrícula, após aplicação de todos os critérios.</div>',
          position: "top",
        },
      },

      // Passo 13 - Critérios de verificação
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-criteria');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">📊 Critérios de Verificação</div>',
          description: `
            <div class="tutorial-description tutorial-criteria">
              <p>A tabela apresenta o resultado dos critérios individuais avaliados:</p>
              <ul>
                <li><strong>📅 Frequência</strong> – mínimo de 96% de atuação</li>
                <li><strong>⏰ Tempo de atuação</strong> – mínimo de 6 meses na Secretaria</li>
                <li><strong>🎓 Formação</strong> – participação em formações continuadas</li>
                <li><strong>📝 Atividades</strong> – entrega de atividades previstas</li>
              </ul>
              <p>Cada critério é classificado como <strong class="text-green-700">"Apto"</strong> ou <strong class="text-red-700">"Não apto"</strong>.</p>
            </div>`,
          position: "top",
        },
      },

      // Passo 14 - Alocações
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-allocations');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">🏫 Alocações</div>',
          description: '<div class="tutorial-description">Registro de onde você trabalhou durante o período: unidade escolar, período, função, carga horária e grupo de gratificação.</div>',
          position: "top",
        },
      },

      // Passo 15 - Frequência/Afastamentos
      {
        element: () => {
          const openAccordionDiv = document.querySelector('.bg-white.border-\\[\\#93b4dc\\]');
          if (openAccordionDiv) {
            return openAccordionDiv.querySelector('#tutorial-frequency');
          }
          return null;
        },
        popover: {
          title: '<div class="tutorial-title">📆 Frequência e Afastamentos</div>',
          description: '<div class="tutorial-description">Lista de todos os seus afastamentos registrados: licenças, faltas, etc., com datas e indicação se foram contabilizados para o cálculo.</div>',
          position: "top",
        },
      },

      // Passo 16 - Botão de recurso
      {
        element: () => document.querySelector('#tutorial-resource'),
        popover: {
          title: '<div class="tutorial-title">📝 Abrir Recurso</div>',
          description: '<div class="tutorial-description">Se identificou algum erro no cálculo, você pode entrar com recurso administrativo clicando neste botão.<br><br><strong>Analise todas as informações com atenção antes!</strong></div>',
          position: "left",
        },
      },

      // Passo 17 - Conclusão
      {
        popover: {
          title: '<div class="tutorial-title">🎉 Tutorial Concluído!</div>',
          description: '<div class="tutorial-description">Agora você já sabe como navegar pelo Painel da Gratificação.<br><br>Confira seus dados e, se precisar, abra um recurso!</div>',
          position: "center",
        },
      },
    ],
  });
};

// Aguarda os dados carregarem
const waitForDataLoad = async () => {
  await nextTick();

  let retries = 0;
  const maxRetries = 20;

  while (retries < maxRetries) {
    const hasData = document.querySelector('.grid-cols-1.sm\\:grid-cols-2');
    if (hasData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    retries++;
  }

  return false;
};

const startTutorial = async () => {
  const dataLoaded = await waitForDataLoad();

  if (!dataLoaded) {
    console.warn('Dados não carregaram completamente');
  }

  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 300));

  driverObj = createDriver();
  driverObj.drive();
};

defineExpose({
  startTutorial
});
</script>

<style>
/* ==========================================
   Driver.js — estilos do popover
   ========================================== */

.driver-popover.custom-tooltip-centered {
  background: white !important;
  color: #1f2937 !important;
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3) !important;
  max-width: 480px !important;
  width: 90vw !important;
  z-index: 10001 !important;
}

.driver-popover[data-position="center"] {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.driver-popover-title {
  background: white !important;
  color: #1a4a8a !important;
  padding: 20px 20px 8px 20px !important;
  margin: 0 !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  border-radius: 16px 16px 0 0 !important;
  border-bottom: none !important;
}

.driver-popover-description {
  background: white !important;
  color: #374151 !important;
  padding: 0 20px 20px 20px !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}

.driver-popover-footer {
  background: white !important;
  padding: 12px 16px 16px 16px !important;
  border-radius: 0 0 16px 16px !important;
  display: flex !important;
  justify-content: flex-end !important;
  gap: 8px !important;
}

.driver-popover-next-btn {
  background: #1a4a8a !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  padding: 8px 20px !important;
  cursor: pointer !important;
  transition: background 0.2s !important;
}

.driver-popover-next-btn:hover {
  background: #0c447c !important;
}

.driver-popover-prev-btn {
  background: #e5e7eb !important;
  color: #374151 !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  padding: 8px 20px !important;
  cursor: pointer !important;
  transition: background 0.2s !important;
}

.driver-popover-prev-btn:hover {
  background: #d1d5db !important;
}

.driver-popover-close-btn {
  background: #ef4444 !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  padding: 8px 20px !important;
  cursor: pointer !important;
  transition: background 0.2s !important;
}

.driver-popover-close-btn:hover {
  background: #dc2626 !important;
}

/* ==========================================
   Conteúdo interno dos popovers
   ========================================== */

.tutorial-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a4a8a;
}

.tutorial-description {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  text-align: left;
}

.tutorial-description strong {
  color: #1a4a8a;
  font-weight: 600;
}

.tutorial-criteria ul {
  margin: 12px 0;
  padding-left: 20px;
}

.tutorial-criteria li {
  margin-bottom: 6px;
  line-height: 1.5;
}

.tutorial-criteria p {
  margin-bottom: 10px;
}

/* ==========================================
   Elemento destacado — apenas anel de foco
   ========================================== */

.driver-active-element,
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(26, 74, 138, 0.5) !important;
  border-radius: 12px !important;
  z-index: 10002 !important;
  position: relative !important;
}

/* ==========================================
   Animações dos botões dinâmicos
   ========================================== */

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* ==========================================
   Responsividade
   ========================================== */

@media (max-width: 640px) {
  .driver-popover.custom-tooltip-centered {
    max-width: 92vw !important;
    border-radius: 14px !important;
  }

  .driver-popover-title {
    font-size: 16px !important;
    padding: 16px 16px 6px 16px !important;
  }

  .driver-popover-description {
    font-size: 13px !important;
    padding: 0 16px 16px 16px !important;
  }

  .driver-popover-next-btn,
  .driver-popover-prev-btn,
  .driver-popover-close-btn {
    padding: 6px 14px !important;
    font-size: 13px !important;
  }

  .tutorial-title {
    font-size: 16px;
  }

  .tutorial-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .driver-popover-footer {
    flex-wrap: wrap !important;
    justify-content: center !important;
  }

  .driver-popover-next-btn,
  .driver-popover-prev-btn,
  .driver-popover-close-btn {
    min-width: 100px !important;
  }
}
</style>