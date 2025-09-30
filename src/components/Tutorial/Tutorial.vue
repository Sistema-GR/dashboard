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
  <!-- Canvas fixo para confetti -->
  <canvas ref="confettiCanvas" 
          class="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
          :style="{ width: '100%', height: '100%' }"></canvas>
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
import confetti from "canvas-confetti";
import { ref, onMounted } from "vue";

const dynamicButtons = ref([]);
const confettiCanvas = ref(null);
let confettiInstance = null;

const startConfettiBurst = () => {
  if (!confettiInstance) {
    confettiInstance = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true
    });
  }

  const count = 1000;
  const defaults = {
    origin: { y: 0.9 },
    spread: 90,
    ticks: 120,
    zIndex: 9999,
    resize: true
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      scalar: window.innerWidth < 768 ? 0.8 : 1
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

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
    startConfettiBurst();
  },
  steps: [
    // Step 1
    {
      popover: {
        title: '<div class="titulo-img"><img src="/src/assets/images/inicioTutorial.png" class="responsive-img" />👋 Bem-vindo ao painel de gratificação</div>',
        description: '<div class="descricao">Estamos felizes por você estar aqui! Este tutorial rápido vai te ajudar a entender todas as informações importantes sobre sua gratificação.<br><br><strong>Verifique se seus dados estão corretos.</strong></div>',
        position: "center",
      },
      onNext: () => {
        dynamicButtons.value = [
          { label: "Botão Extra", action: () => alert("Extra acionado!") },
          { label: "Pular Tutorial", action: () => driverObj.moveNext(16) }
        ];
      },
    },
    // Step 2
    {
      element: "#tutorial-server-name",
      popover: {
        title: '<div class="titulo-img">Nome do servidor</div>',
        description: '<div class="descricao">Este é o nome registrado no sistema para a gratificação.</div>',
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
        description: '<div class="descricao">Aqui você visualiza o valor bruto da sua gratificação. Lembre-se que este valor não inclui os descontos de impostos.</div>',
        position: "bottom",
      },
      onNext: () => {
        dynamicButtons.value = [
          { label: "Ver Detalhes", action: () => driverObj.moveNext(3) }
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
        description: '<div class="descricao">Aqui mostrar todas as suas matriculas ativas e os detalhes de cada uma.</div>',
        position: "top",
      },
      onHighlightStarted: () => {
        openAccordion("#tutorial-details");
      }
    },
    // Step 6
    {
      element: "#tutorial-matricula-0",
      popover: {
        title: '<div class="titulo-img">Detalhamento por matrícula</div>',
        description: '<div class="descricao">Visualize neste campo uma das suas matrículas que estão atualmente ativas no sistema.</div>',
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
        description: '<div class="descricao">Aqui estão os seus dados da sua matrícula</div>',
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
        description: '<div class="descricao">Aqui mostra o valor total da sua rede.</div>',
        position: "top",
      },
    },
    // Step 10
    {
      element: "#tutorial-valor-unidade",
      popover: {
        title: '',
        description: '<div class="descricao">Aqui mostra o valor máximo recebido por unidade.</div>',
        position: "top",
      },
    },
    // Step 11
    {
      element: "#tutorial-desconto",
      popover: {
        title: '',
        description: '<div class="descricao">Nesse campo mostra o desconto caso não tenha completado 100% dos critérios.</div>',
        position: "top",
      },
    },
    // Step 12
    {
      element: "#tutorial-valor-total",
      popover: {
        title: '',
        description: '<div class="descricao">É aqui, mostra o valor total que você ira receber.</div>',
        position: "top",
      },
    },
    // Step 13
    {
      element: "#tutorial-criteria",
      popover: {
        title: '<div class="titulo-img">Critérios de aptidão</div>',
        description: `
          <div class="descricao">
            A tabela apresenta quatro critérios principais de avaliação:
            <ul>
              <li><strong>Frequência</strong> – exige no mínimo 96% de presença.</li>
              <li><strong>Tempo de atuação</strong> – requer no mínimo 6 meses de experiência.</li>
              <li><strong>Formação</strong> – considera a escolaridade ou cursos exigidos para a função.</li>
              <li><strong>Atividades</strong> – avalia se todas as atividades previstas foram cumpridas.</li>
            </ul>
            Para cada critério, a tabela indica se o participante está 
            <strong>"Apto"</strong> (quando o requisito foi atendido) ou 
            <strong>"Não Apto"</strong> (quando não alcançou o mínimo necessário).
          </div>`,
        position: "top",
      },
    },
    // Step 14
    {
      element: "#tutorial-allocations",
      popover: {
        title: '<div class="titulo-img">Alocações</div>',
        description: '<div class="descricao">Aqui você vê onde trabalhou durante o período, incluindo: unidade escolar, período (início/fim), função exercida, carga horária e grupo de gratificação.</div>',
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
        description: '<div class="descricao">Se você acha que alguma informação está incorreta ou quer contestar algum critério, clique em "Recurso". Você pode anexar documentos para comprovar seu ponto de vista.</div>',
        position: "left",
      },
    },
    // Step 17 - Final
    {
      popover: {
        title: '<div class="titulo-img"><img src="/src/assets/images/TutorialConcluido.png" class="responsive-img" />Você concluiu o tutorial!</div>',
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
  confettiInstance = confetti.create(confettiCanvas.value, {
    resize: true,
    useWorker: true,
    disableForReducedMotion: true
  });
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
  width: 90vw !important;
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
  padding: 0 20px 20px 20px !important;
  border-top: 1px solid #e0e0e0 !important;
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
  padding: 20px 0;
  line-height: 1.6;
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

/* Canvas */
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
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