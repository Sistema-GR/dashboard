<template>
  <!-- Botão fixo para iniciar tutorial -->
  <button
    @click="startTutorial"
    class="fixed bottom-16 right-6 bg-azure-800 text-white p-3 rounded-full shadow-md hover:bg-azure-900 transition-colors z-50 sm:bottom-20 sm:right-8 md:p-4"
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
 
  <!-- Botões dinâmicos animados -->
  <transition-group
    name="fade-slide"
    tag="div"
    class="fixed bottom-20 right-4 sm:bottom-28 sm:right-8 md:bottom-32 md:right-12 flex flex-col gap-2 z-50"
  >
    <button
      v-for="(btn) in dynamicButtons"
      :key="btn.label"
      @click="btn.action"
      class="tutorial-nav-btn px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
    >
      {{ btn.label }}
    </button>
  </transition-group>
</template>

<script setup>
// Função para abrir accordions durante o tutorial
const openAccordion = (selector) => {
  const accordion = document.querySelector(selector);
  if (accordion && typeof accordion.click === 'function') {
    accordion.click();
  } else if (accordion) {
    accordion.setAttribute('open', 'true');
    accordion.dispatchEvent(new Event('change'));
  }
};

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { ref, onMounted } from "vue";

const dynamicButtons = ref([]);

const driverObj = driver({
  popoverClass: 'custom-tooltip-centered',
  showProgress: true,
  showButtons: ["next", "previous", "close"],
  nextBtnText: "Próximo",
  prevBtnText: "Anterior",
  doneBtnText: "Fim",
  closeBtnText: "Voltar",
  progressText: "Passo {{current}}/{{total}}",
  overlayColor: "rgba(0, 0, 0, 0.6)",
  allowClose: false,
  onDestroyed: () => {
    dynamicButtons.value = [];
  },
  steps: [
    // Step 1
    {
      popover: {
        title: '<div class="titulo-img"><img src="/src/assets/images/inicio-tutorial.png" class="responsive-img" />👋 Bem-vindo ao painel de gratificação</div>',
        description: '<div class="descricao">Estamos felizes por você estar aqui! Este tutorial rápido vai te ajudar a entender todas as informações importantes sobre sua gratificação.<br><br><strong>Após o tutorial, verifique seus dados com atenção!</strong></div>',
        position: "center",
      },
      onNext: () => {
        dynamicButtons.value = [
          { label: "Pular Tutorial", action: () => driverObj.drive(16) }
        ];
      },
    },
    // Step 2
    {
      element: "#tutorial-server-name",
      popover: {
        title: '<div class="titulo-img">Nome do servidor</div>',
        description: '<div class="descricao">Este é o nome do usuário a quem as informações exibidas no painel pertencem.</div>',
        position: "bottom",
      },
      onNext: () => {
        dynamicButtons.value = [];
      },
    },
    // Step 3
    {
      element: "#tutorial-value",
      popover: {
        title: '<div class="titulo-img">Seu Valor de Gratificação</div>',
        description: '<div class="descricao">Aqui você visualiza o valor bruto da sua gratificação, já avaliado conforme os critérios individuais e somando todos os vínculos que possuam valores a receber. Lembre-se de que este valor não inclui os descontos de impostos.</div>',
        position: "bottom",
      },
      onNext: () => {
        dynamicButtons.value = [
          { label: "Ver Detalhes", action: () => driverObj.drive(4) }
        ];
      },
    },
    // Step 4
    {
      element: "#tutorial-warning",
      popover: {
        title: '',
        description: '<div class="descricao">Os valores mostrados são brutos, sem os descontos de impostos que podem ser aplicados.</div>',
        position: "top",
      },
    },
    // Step 5
    {
      element: "#tutorial-details",
      popover: {
        title: '',
        description: '<div class="descricao">Abaixo de "Detalhamento por matrícula" são exibidas separadamente as informações de cada um dos seus vínculos com a Secretaria de Educação, referentes ao ano de competência da gratificação.</div>',
        position: "top",
      },
    },
    // Step 6
    {
      element: "#tutorial-matricula-0",
      popover: {
        title: '<div class="titulo-img">Detalhamento por matrícula</div>',
        description: '<div class="descricao">Visualize neste campo cada uma das suas matrículas ativas durante o ano de competência da gratificação. <br><br>Não se esqueça de clicar na matrícula desejada para expandir as informações!</div>',
        position: "top",
      },
      onHighlightStarted: () => {
        openAccordion("#tutorial-matricula-0");
      }
    },
    // Step 7
    {
      element: "#painel-infos",
      popover: {
        title: '<div class="titulo-img">Matrícula</div>',
        description: '<div class="descricao">Aqui está o resumo das informações pessoais e a receber da matrícula selecionada.</div>',
        position: "top",
      },
    },
    // Step 8
    {
      element: "#tutorial-table-dados",
      popover: {
        title: '<div class="titulo-img">Dados da Matrícula</div>',
        description: '<div class="descricao">Nesse quadro mostra seus dados. Certifique que todos estão corretos!</div>',
        position: "top",
      },
    },
    // Step 9
    {
      element: "#tutorial-valor-rede",
      popover: {
        title: '',
        description: '<div class="descricao">Aqui está o <strong>valor máximo</strong> que você <strong>poderá</strong> receber pelo resultado da rede como um todo.</div>',
        position: "top",
      },
    },
    // Step 10
    {
      element: "#tutorial-valor-unidade",
      popover: {
        title: '',
        description: '<div class="descricao">Aqui está o <strong>valor máximo</strong> que você <strong>poderá</strong> receber pelo resultados das unidades e etapas em que atuou.</div>',
        position: "top",
      },
    },
    // Step 11
    {
      element: "#tutorial-desconto",
      popover: {
        title: '',
        description: '<div class="descricao">Aqui está o <strong>valor descontado</strong> caso <strong>não tenha atingido</strong> 100% do critério individual de frequência.</div>',
        position: "top",
      },
    },
    // Step 12
    {
      element: "#tutorial-valor-total",
      popover: {
        title: '',
        description: '<div class="descricao">Este é o valor total que você tem direito de receber nesta matrícula.</div>',
        position: "top",
      },
    },
    // Step 13
    {
      element: "#tutorial-criteria",
      popover: {
        title: '<div class="titulo-img">Critérios Individuais</div>',
        description: `
          <div class="descricao criterios-description">
            <p>A tabela apresenta o resultado dos critérios individuais avaliados para o recebimento:</p>
            <ul>
              <li><strong>Frequência</strong> – exige no mínimo 96% de atuação, proporcionada conforme a Lei 90214/2022.</li>
              <li><strong>Tempo de atuação</strong> – requer no mínimo 6 meses de atuação na Secretaria de educação para a matrícula avaliada.</li>
              <li><strong>Formação</strong> – resultado da frequência da participação nas formações continuadas, paradas pedagógicas e outras atividades formativas obrigatórias.</li>
              <li><strong>Atividades</strong> – avalia se todas as atividades previstas foram entregues conforme cronogramas.</li>
            </ul>
            <p>Para cada critério, a tabela indica se o participante está <strong>"Apto"</strong> (quando o requisito foi atendido), <strong>"Não Apto"</strong> (quando não alcançou o mínimo necessário), ou <strong>"Parcialmente Apto"</strong> quando atingido parcialmente.</p>
            <p><strong>Atenção!</strong> Lembre-se que todos os critérios individuais levam em consideração apenas o ano da competência do cálculo e não os anos anteriores!</p>
          </div>`,
        position: "top",
      },
    },
    // Step 14
    {
      element: "#tutorial-allocations",
      popover: {
        title: '<div class="titulo-img">Alocações</div>',
        description: '<div class="descricao">Aqui está o registro de onde trabalhou durante o período, incluindo: unidade escolar, período (início/fim), função exercida, carga horária e grupo de gratificação. <br><br>Atenção! Lembre-se que todos os critérios individuais levam em consideração apenas o ano da competência do cálculo e não os anos anteriores!</div>',
        position: "top",
      },
    },
    // Step 15
    {
      element: "#tutorial-frequency",
      popover: {
        title: '<div class="titulo-img">Frequência</div>',
        description: '<div class="descricao">Esta seção mostra todos os seus afastamentos registrados: licenças, faltas justificadas, etc. Mostra as datas, tipo de afastamento e se foram contabilizados para o cálculo.</div>',
        position: "top",
      },
    },
    // Step 16
    {
      element: "#tutorial-resource",
      popover: {
        title: '<div class="titulo-img">Recurso</div>',
        description: '<div class="descricao">Caso tenha identificado algum erro no cálculo, você pode entrar com recurso administrativo clicando neste botão.<br><br>Mas antes, lembre-se de analisar com atenção todas as informações do painel!</div>',
        position: "left",
      },
    },
    // Step 17 - Final
    {
      popover: {
        title: '<div class="titulo-img"><img src="/src/assets/images/tutorial-concluido.png" class="responsive-img" />Você concluiu o tutorial!</div>',
        description: '<div class="descricao">Agora você está pronto para navegar pelo painel de gratificação e acompanhar as informações com facilidade.</div>',
        position: "center",
      }
    },
  ],
});

const startTutorial = () => {
  driverObj.drive();
};

onMounted(() => {  
  window.dispatchEvent(new Event('resize'));
});

defineExpose({
  startTutorial
});
</script>

<style>
/* Estilos limpos e focados apenas na correção dos bugs */
.driver-popover.custom-tooltip-centered,
.driver-popover[data-popover-class="custom-tooltip-centered"] {
  background: white !important;
  color: black !important;
  border-radius: 10px !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
  max-width: 500px !important;
  width: 95vw !important;
  z-index: 10001 !important;
}

/* Centralização forçada para cards center */
.driver-popover[data-position="center"] {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

/* Estrutura dos cards */
.driver-popover-title {
  background: white !important;
  color: black !important;
  padding: 20px !important;
  margin: 0 !important;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: none !important;
}

.driver-popover-description {
  background: white !important;
  color: black !important;
  padding: 0 20px 20px 20px !important;
}

.driver-popover-footer {
  background: white !important;
  padding: 0 10px 10px 10px !important;
  border-radius: 0 0 10px 10px !important;
}

/* Botões */
.driver-popover-next-btn {
  background: linear-gradient(135deg, #152656 0%, #5cabfe 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  min-width: 120px !important;
  min-height: 48px !important;
  padding: 12px 32px !important;
  margin-left: 8px !important;
}

.driver-popover-prev-btn {
  background: linear-gradient(135deg, #222b44c2 0%, #92b5e7b0 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  min-width: 120px !important;
  min-height: 48px !important;
  padding: 12px 32px !important;
  margin-right: 8px !important;
}

.driver-popover-close-btn {
  background: #ef4444 !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  min-width: 120px !important;
  min-height: 48px !important;
  padding: 12px 32px !important;
}

/* Classes customizadas */
.titulo-img {
  display: grid;
  justify-items: center;
  gap: 20px;
  font-size: 20px;
  text-align: center;
  color: black;
}

.descricao {
  font-size: 15px;
  color: black;
  text-align: center;
  line-height: 1.6;
}

/* Estilo específico para critérios - alinhado à esquerda como na imagem */
.criterios-description {
  text-align: left !important;
}

.criterios-description ul {
  margin: 15px 0;
  padding-left: 20px;
}

.criterios-description li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.criterios-description p {
  margin-bottom: 12px;
  line-height: 1.5;
}

.responsive-img {
  max-width: 380px;
  width: 100%;
  height: auto;
}

/* Highlight */
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
  border-radius: 8px !important;
}

/* Responsividade */
@media (max-width: 640px) {
  .driver-popover.custom-tooltip-centered,
  .driver-popover[data-popover-class="custom-tooltip-centered"] {
    max-width: 95vw !important;
  }
  
  .responsive-img {
    max-width: 280px !important;
  }
  
  .titulo-img {
    font-size: 18px !important;
  }
  
  .descricao {
    font-size: 14px !important;
  }
}
</style>