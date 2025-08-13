<template>
  <!-- Botão fixo para iniciar tutorial -->
  <button
    @click="startTutorial"
    class="fixed bottom-4 right-4 bg-azure-800 text-white p-3 rounded-full shadow-lg hover:bg-azure-900 transition-colors z-50"
    title="Iniciar Tutorial"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </button>
  <!-- Botão para testar confete -->
    <button
    @click="startConfettiBurst"
    class="fixed bottom-4 left-4 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors z-50"
    title="Testar Confete"
    >
    🎉
    </button>
 
  <!-- Botões dinâmicos animados -->
  <transition-group
    name="fade-slide"
    tag="div"
    class="fixed bottom-20 right-4 sm:bottom-28 sm:right-8 flex flex-col gap-2 z-50"
  >
    <button
      v-for="(btn) in dynamicButtons"
      :key="btn.label"
      @click="btn.action"
      class="px-4 py-2 rounded-lg bg-green-600 text-white shadow hover:bg-green-700 transition"
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
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import confetti from "canvas-confetti";
import { ref, onMounted, nextTick } from "vue";

const dynamicButtons = ref([]);
const confettiCanvas = ref(null);
let confettiInstance = null;

const openAccordion = (selector) => {
  const accordion = document.querySelector(selector);
  if (accordion && typeof accordion.click === 'function') {
    accordion.click();
  } else if (accordion) {
    accordion.setAttribute('open', 'true');
    accordion.dispatchEvent(new Event('change'));
  }
};

const startConfettiBurst = () => {
  if (!confettiInstance) {
    confettiInstance = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true
    });
  }

  const count = 460;
  const defaults = {
    origin: { y: 0.7 },
    spread: 90,
    ticks: 100,
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
  showProgress: true,
  showButtons: ["next", "previous", "close"],
  nextBtnText: "Próximo",
  prevBtnText: "Anterior",
  doneBtnText: "Fim",
  closeBtnText: "Voltar",
  progressText: "Passo {{current}}/{{total}}",
  popoverClass: "custom-tooltip",
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
        title: '<img src="/src/assets/images/inicioTutorial.png" style="max-width:300px" />👋 Bem-vindo ao painel de gratificação',
        description: "Estamos felizes por você estar aqui! Este tutorial rápido vai te ajudar a entender todas as informações importantes sobre sua gratificação.<br><br><strong>Verifique se seus dados estão corretos.</strong>",
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
        title: "Nome do servidor",
        description: "Este é o nome registrado no sistema para a gratificação.",
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
        title: "Seu Valor de Gratificação",
        description: "Aqui você visualiza o valor bruto da sua gratificação. Lembre-se que este valor não inclui os descontos de impostos.",
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
        title:"",
        description: "Os valores mostrados são brutos, sem os descontos de impostos que podem ser aplicados.",
        position: "top",
      },
    },
    // Step 5
    {
      element: "#tutorial-details",
      popover: {
        title: "",
        description: "Aqui mostrar todas as suas matriculas ativas e os detalhes de cada uma.",
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
        title: "Detalhamento por matrícula",
        description: "Visualize neste campo uma das suas matrículas que estão atualmente ativas no sistema.",
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
        title: "Matrícula",
        description: "Aqui estão os seus dados da sua matrícula",
        position: "top",
      },
    },
    // Step 8
    {
      element: "#tutorial-table-dados",
      popover: {
        title:
          " Dados da Matrícula",
        description: "Nesse quadro mostra seus dados. Certifique que todos estão corretos!",
        position: "top",
      },
    },
    // Step 9
    {
      element: "#tutorial-valor-rede",
      popover: {
        title: "",
        description: "Aqui mostra o valor total da sua rede.",
        position: "top",
      },
    },
    // Step 10
    {
      element: "#tutorial-valor-unidade",
      popover: {
        title: "",
        description: "Aqui mostra o valor máximo recebido por unidade.",
        position: "top",
      },
    },
    // Step 11
    {
      element: "#tutorial-desconto",
      popover: {
        title: "",
        description: "Nesse campo mostra o desconto.",
        position: "top",
      },
    },
    // Step 12
    {
      element: "#tutorial-valor-total",
      popover: {
        title: "",
        description: "É aqui, mostra o valor total que você ira receber.",
        position: "top",
      },
    },
    // Step 13
    {
      element: "#tutorial-criteria",
      popover: {
        title:
          'Critérios de aptidão',
        description: 'Esta tabela mostra os 4 critérios principais: frequência (mín. 96%), tempo de atuação (mín. 6 meses), Formação e Atividades. Cada um, mostra se você está "Apto" ou "Não Apto".',
        position: "top",
      },
    },
    // Step 14
    {
      element: "#tutorial-allocations",
      popover: {
        title:"Alocações",
        description: "Aqui você vê onde trabalhou durante o período, incluindo: unidade escolar, período (início/fim), função exercida, carga horária e grupo de gratificação.",
        position: "top",
      },
    },
    // Step 15
    {
      element: "#tutorial-frequency",
      popover: {
        title:"Frequência",
        description:"Esta seção mostra todos os seus afastamentos registrados: licenças, faltas justificadas, etc. Mostra as datas, tipo de afastamento e se foram contabilizados para o cálculo.",
        position: "top",
      },
    },
    // Step 16
    {
      element: "#tutorial-resource",
      popover: {
        title:"Recurso",
        description: 'Se você acha que alguma informação está incorreta ou quer contestar algum critério, clique em "Recurso". Você pode anexar documentos para comprovar seu ponto de vista.',
        position: "left",
      },
    },
 // Step 17 - Final
    {
      popover: {
        title: '<img src="/src/assets/images/TutorialConcluido.png" style="max-width:300px" />Você concluiu o tutorial!',
        description: "Agora você está pronto para navegar pelo painel de gratificação e acompanhar as informações com facilidade.",
        position: "center",
      }
    },
  ],
});

const startTutorial = () => {
  driverObj.drive();
};

onMounted(() => {
  nextTick(() => {
    confettiInstance = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true
    });
    window.dispatchEvent(new Event('resize'));
  });
});
</script>

<style scoped>
/* Tooltip customizado */
.custom-tooltip {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important;
  color: #f0f9ff !important;
  border-radius: 16px !important;
  padding: 20px !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
  max-width: 500px !important;
  width: 90vw !important;
  font-family: "Inter", sans-serif !important;
}

.custom-tooltip h3 {
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  margin-bottom: 12px !important;
  color: white !important;
}

.custom-tooltip p {
  font-size: 1.05rem !important;
  margin-top: 12px !important;
  line-height: 1.5 !important;
  color: #e0f2fe !important;
}

.custom-tooltip .driver-popover-footer {
  margin-top: 16px !important;
}

.custom-tooltip .driver-popover-btn {
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
}

.custom-tooltip .driver-popover-next-btn {
  background-color: #10b981 !important;
  color: white !important;
}

.custom-tooltip .driver-popover-next-btn:hover {
  background-color: #059669 !important;
}

.custom-tooltip .driver-popover-prev-btn {
  background-color: #3b82f6 !important;
  color: white !important;
}

.custom-tooltip .driver-popover-prev-btn:hover {
  background-color: #2563eb !important;
}

.custom-tooltip .driver-popover-close-btn {
  background-color: #ef4444 !important;
  color: white !important;
}

.custom-tooltip .driver-popover-close-btn:hover {
  background-color: #dc2626 !important;
}

.custom-tooltip .driver-popover-progress-text {
  color: #93c5fd !important;
  font-weight: 500 !important;
}

@media (max-width: 640px) {
  .custom-tooltip {
    max-width: 95vw !important;
    padding: 12px !important;
    font-size: 0.95rem !important;
  }
  .custom-tooltip h3 {
    font-size: 1.1rem !important;
  }
}

/* Animação botões */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Highlight do elemento */
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
  border-radius: 8px !important;
  transition: box-shadow 0.3s !important;
}

canvas {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>